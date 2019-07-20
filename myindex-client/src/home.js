import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {fetcher} from './utilities';
import {StockChart} from './StockChart';

const DAYS = 10;

export function Home(props){
   var [chartData, setChartData] = useState([]);
   
   useEffect( ()=>{
      getData();
   },[]);
   async function getData(){
      for (let index of props.indexes){
         let indexData = await fetcher(`data/index/${index.name}/${DAYS}`)
         setChartData([...chartData, indexData]);
      }
   };

   return(
      <section className="home-container has-background-primary has-text-light">
         <div className="home-content">
            <h1 className="title animated fadeInUp">myIndex</h1>
            <h2 className="subtitle animated fadeInUp">instant custom stock indexes</h2>
            <br />
            <div className="buttons">
               <Link to="/make" className="button is-warning animated fadeIn">
                  make your own
               </Link>
               <Link to="/browse" className="button is-warning animated fadeIn">
                  browse indexes
               </Link>
            </div>
         </div>
         <div className="home-content">
            <div className="animated fadeIn has-text-centered">
               <StockChart data = {chartData[0]} />
               <br />
               <progress className="progress is-warning" value="0" max="100">
                  Loading
               </progress>
            </div>
         </div>
      </section>
   );
}

function prepData(indexData){
   var data = [], labels = [];
   

   return {data: data, dates: labels};
}