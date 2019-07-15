//index-calc.js
const datefns = require('date-fns');
const log = require('./log');
const _ = require('lodash');

/**
 * calculates index given an array of prices
 * discards any days that dont have data from all symbols
 * 
 * @param {array} prices array of price objects sorted by date descending
 *  @property {number} date a unix timestamp
 *  @property {string} symbol 
 *  @property {number} mktcap
 *  @property {number} price
 * 
 * @returns {array} an array of index price objects
 *  @property {number} date
 *  @property {number} mktcap
 */
function calculate(prices){
   var uniqueStocks = _.uniqBy(prices, 'symbol').length;
   var index = [], dayPrices = [];
   var date = new Date(prices[0].date*1000);

   for (let price of prices){
      if(datefns.isSameDay(date, new Date(price.date*1000))) 
         dayPrices.push(price.mktcap);
      else{
         date = new Date(price.date*1000); //next day in data
         dayPrices = [price.mktcap]; //reset dayPrices
      }

      if(uniqueStocks==dayPrices.length){ // average when we have the whole day
         index.push({
            date: Math.round(date.getTime()/1000), 
            mktcap: average(dayPrices)
         });  
      }
   }
   return index;
}

//average market cap for a single day
function average(dayPrices){  
   let sum = dayPrices.reduce((s, i)=>{return i+s});
   let average = sum / dayPrices.length;

   return average;
}

module.exports = calculate;