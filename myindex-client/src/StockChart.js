import React, {useState, useEffect} from 'react';
import * as datefns from 'date-fns';

import {Line} from 'react-chartjs-2';

export function StockChart(props){
   var chartConfig = {};

   var labels = getWeekdays(props.days);
   var showlabels = shortlabels(labels);
   var data = {
      labels: showlabels,
      datasets: prepData(props.data, labels),
   };

   return(<Line data = {data} options = {chartConfig} height = {300} width={500} />);
   
}
/** get YYYY-MM-DD weekdays for the specified number of days in the past
 * 
 */

function getWeekdays(days){
   var dateList = [];
   var today = new Date();
   
   for(let cnt=days; cnt>0; cnt--){
      var day = datefns.subDays(today, cnt);
      if (!datefns.isWeekend(day))
         dateList.push(datefns.format(day, "YYYY-MM-DD"));
   }
   return dateList;
}

//get shorter date labels for display
function shortlabels(labels){
   var shortLabels = []
   for(let label in labels){
      shortLabels.push(datefns.format(new Date(labels[label]), "MMM D"));
   }
   return shortLabels;
}

function prepData(data, labels){
   var datasets = [];
   var colorMaker = getColor();
   for (let set of data){
      let firstPrice = null;
      if(!set || !set.data)
         continue;
      let tempData = [];
      for(let label of labels){
         let match = set.data.find((el)=>{
            if(el.date===label)
               return el;
         });

         if(match) {
            if(firstPrice===null) firstPrice=match.mktcap;
            tempData.push( percentChange(match.mktcap, firstPrice) );
         }
         else
            tempData.push(null);
      }
      console.log(set.name, tempData);
      
      let color = colorMaker();
      console.log(color);
      datasets.push({
         data: tempData,  
         label: set.name, 
         fill: false, 
         borderColor: color, 
         backgroundColor: color,
         spanGaps: true,
      });
   }
   return datasets;
}

function getColor(){
   var colors =[218, 0,30,60,90,120,150,180,210,240,270,300,330,360];
   var cnt=0;
   return ()=>{
      if(cnt<colors.length)
         cnt++;
      else
         cnt=0;
      console.log(cnt);
      return `hsl(${colors[cnt]},70%,55%)`
   }
}

function percentChange(newNumber, originalNumber){
   return Math.round((newNumber-originalNumber)/originalNumber *1000) / 10;
}