import React, {useState} from 'react';
import {fetcher} from './utilities';
import {StockChart} from './StockChart';

export function Make(props){
   var [chartData, setChartData] = useState([]);
   var [days, setDays] = useState(90);

   async function addStockData(symbol){
      let button = document.querySelector('#addButton');
      button.classList.add('is-loading');

      let data = await fetcher(`data/symbols/${symbol}/${days}`);
      let newData = {
         data: data.data, 
         name: symbol
      };
      setChartData ( [...chartData, newData]);
        
      
      button.classList.remove('is-loading');
   }

   function removeStock(symbol){
      let newList = chartData.filter(s=>s.name!==symbol);
      setChartData(newList);
   }


   function getSymbols(name){
      var symbols = props.indexes.find(i=>i.name===name).symbols.split(',');
      return symbols.map(s=> { return {
         symbol: s,
         name: props.symbols.find(i=>(i.symbol==s)).name
      }});
   }

   return(
      <div className="padded">
         <div className="columns">
            <div className="column">

            </div>
            <div className="column">
               <StockChart data = {chartData} days = {days} />
               <div>
               {chartData.map(index=>
                  <StockList name={index.name} symbols = {getSymbols(index.name)} key={index.name} />
               )}
               </div>
            </div>
         </div>
      </div>
   );
}

function StockList(props){
   return(
      <div className="box">
         <h3 className = "title is-5"> {props.name} </h3>
         <div className="tags">
            {props.symbols.map(s=><Tag key={s.symbol} name={s.name} symbol={s.symbol} />)}
         </div>
      </div>
   );
}

function Tag(props){
   return <span className="tag" title={props.name}> {props.symbol} </span>;
}

