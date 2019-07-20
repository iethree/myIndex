import React, {useState, useEffect} from 'react';

import {Line} from 'react-chartjs-2';

const DAYS = 90;

export function StockChart(props){
   var chartConfig = {
      
   };
   var data = {
      labels: ['day1', 'day2', 'day3', 'day4'],
      datasets: [{
         data: [20, -20, null,  30],  
         label: "set name", 
         fill: false, 
         borderColor: '#603', 
         backgroundColor: "#603",
         spanGaps: true,
      }]
   };

   return(<Line data = {data} options = {chartConfig} height = {300} width={500} />);
   
}