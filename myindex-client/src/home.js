import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {fetcher} from './utilities';
import {StockChart} from './StockChart';

const DAYS = 30;

export function Home(props){
   var [indexData, setIndexData] = useState([]);
   var [chartData, setChartData] = useState({});
   var [progress, setProgress] = useState(0);
   var showCnt=0;
   
   useEffect( ()=>{
      setInterval(()=>{
         if(showCnt<indexData.length-1) showCnt++;
         else showCnt=0;
         setChartData(indexData[showCnt]);
      }, 5000);
      getData();
   },[]);

   async function getData(){
      let cnt=0;
      console.log(props.indexes);
      for (let index of props.indexes){
         let data = await fetcher(`data/index/${index.name}/${DAYS}`);

         if(data.data.length){
            let newData = {
               data: data.data, 
               name: index.name
            };
            indexData.push(newData);
            setIndexData(indexData);
            if(indexData.length==1) setChartData(indexData[0]);
         }
         
         //update progress bar
         cnt++;
         setProgress(Math.floor((cnt/props.indexes.length)*100));
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
               <StockChart data = {[chartData]} days = {DAYS} />
               <br />
               <Progress percent={progress} />
            </div>
         </div>
      </section>
   );
}

function Progress(props){
   if(props.percent<100)
      return(
         <progress className="progress is-warning" value={props.percent} max="100">
            Loading...
         </progress>
      );
   else
      return null;
}