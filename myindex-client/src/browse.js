import React, {useState, useEffect} from 'react';
import {fetcher} from './utilities';
import {StockChart} from './StockChart';

export function Browse(props){
   var [chartData, setChartData] = useState([]);
   var [days, setDays] = useState(90);

   async function getIndexData(e, name){
      let button = e.target;
      button.classList.add('is-loading');

      let newList = chartData.filter(chart=>chart.name!==name);

      if(newList.length===chartData.length){
         let data = await fetcher(`data/index/${name}/${days}`);
         let newData = {
            data: data, 
            name: name
         };
         setChartData ( [...chartData, newData]);
      }
      else
         setChartData(newList);
      
      button.classList.toggle('selected');
      button.classList.remove('is-loading');
   }
   function hideChildren(){
      document.querySelector('.menu-list').classList.toggle('hidden');
      let toggle=document.querySelector('#caret')
      toggle.classList.toggle('fa-caret-up');
      toggle.classList.toggle('fa-caret-down');
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
            <aside className="menu column">
               
               <div className="menu-label" >
                  
                  <span id="showToggle" onClick={hideChildren}>User Indexes <i id="caret" className="fa fa-caret-up" /></span>
                  <ul className="menu-list">
                     {props.indexes ? props.indexes.map(index=>
                           <li key={index.name}>
                              <button  className="button is-size-7 index-tab linkbutton" onClick={e=>getIndexData(e, index.name)} > {index.name} </button>
                           </li>
                     ) : null }
                     
                  </ul>

               </div>
            </aside>
            <div className="column has-text-centered">
               <DateRange days = {days} setDays = {setDays} />
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
            {props.symbols.map(s=><Tag name={s.name} symbol={s.symbol} />)}
         </div>
      </div>
   );
}

function Tag(props){
   return <span className="tag" title={props.name}> {props.symbol} </span>;
}

