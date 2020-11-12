import './App.css';
import React, { useEffect } from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:1978";


const usdArr = [];
const gbpArr = [];
const eurArr = [];
const jpyArr = [];


function App() {

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('subscribed-btc-prices', tickerdata => {
      refreshTicker(tickerdata);
    });
  }, []);


  



  return (
    <div className="App">
      <section>
        <h2>Bitcoin RealTime Data</h2>
        <table id="btcticker" class="table-striped">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Price</th>
              <th>Volume</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" data-currency="">Fetching data...Please wait for 5 sec</td>
            </tr>
          </tbody>
        </table>
        <div id="tickertape" class="ticker-tape"></div>
        
      </section>
    </div>
  );
}






function refreshTicker(tickerdata) {
  const tblBTC = document.getElementById("btcticker");
  const tblRow = tblBTC.getElementsByTagName("tr");
  let rowCnt = 0;

  tickerdata.map((item) => {
    for (let i = 0; i < tblRow.length; i++) {
      const tblCol = tblRow[i].getElementsByTagName("td")[0];
      if (tblCol) {
        const txtValue = tblCol.getAttribute('data-currency');
        if (txtValue === '' || txtValue === item.target) {
          tblBTC.deleteRow(i);
        }
      }
    }

    const tblBTCbody = document.getElementById('btcticker').getElementsByTagName('tbody')[0];
    const newRow = tblBTCbody.insertRow(rowCnt);
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    cell1.innerHTML = printCurrency(item.target);
    cell1.setAttribute('data-currency', item.target);
    cell2.innerHTML = item.price;
    cell3.innerHTML = item.volume;
    cell4.innerHTML = item.change;
    cell5.innerHTML = '<span id="sparkline-' + item.target + '"></span>';
    rowCnt++;
  });
  console.log(tickerdata);
  tapeTicker(tickerdata);
}


function printCurrency(currency) {
  switch (currency) {
    case 'USD':
      return '<span class="currency">$</span>';
    case 'GBP':
      return '<span class="currency">&pound;</span>';
    case 'EUR':
      return '<span class="currency">&euro;</span>';
    case 'JPY':
      return '<span class="currency">&yen;</span>';
  }
}
function tapeTicker(tickerdata) {
  const ticker = document.getElementById('tickertape');
  ticker.innerHTML = `Bitcoin (BTC): <b>${roundNumber(tickerdata[0].price)}</b> USD ${getDirection(tickerdata[0].target)} <i class="seperator"></i> <b>${roundNumber(tickerdata[1].price)}</b> GBP ${getDirection(tickerdata[1].target)} <i class="seperator"></i> <b>${roundNumber(tickerdata[2].price)}</b> EUR ${getDirection(tickerdata[2].target)} <i class="seperator"></i> <b>${roundNumber(tickerdata[3].price)}</b> JPY ${getDirection(tickerdata[3].target)}<br>
		<span>Updated on: ${formatDate()}</span>`;

}


function roundNumber(num) {
  return parseFloat(num).toFixed(2);
}

function getDirection(currency) {
  switch (currency) {
    case 'USD':
      return (usdArr[usdArr.length - 2] === usdArr[usdArr.length - 1]) ? '<i class="nochange"></i>' : (usdArr[usdArr.length - 2] > usdArr[usdArr.length - 1]) ? '<i class="down"></i>' : '<i class="up"></i>';
    case 'GBP':
      return (gbpArr[gbpArr.length - 2] === gbpArr[gbpArr.length - 1]) ? '<i class="nochange"></i>' : (gbpArr[gbpArr.length - 2] > gbpArr[gbpArr.length - 1]) ? '<i class="down"></i>' : '<i class="up"></i>';
    case 'EUR':
      return (eurArr[eurArr.length - 2] === eurArr[eurArr.length - 1]) ? '<i class="nochange"></i>' : (eurArr[eurArr.length - 2] > eurArr[eurArr.length - 1]) ? '<i class="down"></i>' : '<i class="up"></i>';
    case 'JPY':
      return (jpyArr[jpyArr.length - 2] === jpyArr[jpyArr.length - 1]) ? '<i class="nochange"></i>' : (jpyArr[jpyArr.length - 2] > jpyArr[jpyArr.length - 1]) ? '<i class="down"></i>' : '<i class="up"></i>';
  }
}

function formatDate() {
  const date = new Date();
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const [{ value: mn }, , { value: day }, , { value: yr }, , { value: hr }, , { value: min }, , { value: sec }] = dateTimeFormat.formatToParts(date);
  return `${day}-${mn}-${yr} ${hr}:${min}:${sec}`;
}




export default App;
