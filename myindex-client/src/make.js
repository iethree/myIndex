import React, {useState, useEffect} from 'react';
import {fetcher} from './utilities';
import {StockChart} from './StockChart';
import * as _ from 'lodash';

export function Make(props){
   var [chartData, setChartData] = useState([]);
   var [days, setDays] = useState(90);
   
   useEffect(()=>{
      addStocks(["msft","aapl"]);
   },[])

   async function addStocks(symbols){
      if(!symbols || !symbols.length)
         return false;
      
      let currentSymbols = getSymbols();
      let nondupes = symbols.filter(s=>currentSymbols.indexOf(s)===-1);
      
      if(!nondupes.length)
         return false;
      
      let newData = await fetcher(`data/symbols/${nondupes.join(',')}/${days}`);
      console.log(newData);
      setChartData ( [...chartData, ...newData]);
      
   }

   function removeStock(symbol){
      let newList = chartData.filter(s=>s.symbol!==symbol);
      setChartData(newList);
   }

   function getSymbols(){
      return _.uniq(chartData.map(chartData=>chartData.symbol));
   }

   return(
      <div className="padded">
         <div className="columns">
            <div className="column is-one-third">
               <StockPicker add={addStocks()} />
            </div>
            <div className="column">
               <DateRange days = {days} setDays = {setDays} />
               <StockChart data = {chartData} days = {days} />
               <div>
                  <StockList name="New Index" symbols = {getSymbols()} />
               </div>
            </div>
         </div>
      </div>
   );
}

function DateRange(props){

   return(
      <div className="has-text-centered"> 
         <DayButton key="30"  days = {30}  current={props.days} setDays={props.setDays}/>
         <DayButton key="90"  days = {90}  current={props.days} setDays={props.setDays}/>
         <DayButton key="180" days = {180} current={props.days} setDays={props.setDays}/>
          days
      </div>
   );
}
function DayButton(props){

   var current = props.current===props.days ? "is-active" : '';

   return(
      <button 
         className={"daybutton " + current}
         onClick = {()=>props.setDays(props.days)}>
         {props.days}
      </button>
   );
}
function StockList(props){
   return(
      <div className="box">
         <h3 className = "title is-5 has-text-left"> {props.name} </h3>
         <div className="tags">
            {props.symbols.map(s=><Tag key = {s} symbol={s} />)}
         </div>
      </div>
   );
}

function Tag(props){
   return <span className="tag" title={props.name}> {props.symbol} </span>;
}

function StockPicker(props){

   return(
      <div></div>
   );
}

