//index-calc.js
const datefns = require('date-fns');
const tz = require('date-fns-timezone');
const log = require('./log');
const _ = require('lodash');

/**
 * calculates index given an array of prices
 * discards any days that dont have data from all symbols
 * 
 * @param {array} prices array of price objects sorted by date descending
 *  @property {number} date a unix UTC timestamp
 *  @property {string} symbol 
 *  @property {number} mktcap
 *  @property {number} price
 * 
 * @returns {array} an array of index price objects
 *  @property {string} date "yyyy-mm-dd"
 *  @property {number} mktcap
 */
function calculate(prices){
   var uniqueStocks = _.uniqBy(prices, 'symbol').length;
   var index = [], dayPrices = [];
   var date = shortEST(prices[0].date);

   for(let price of prices){
      if(date===shortEST(price.date)) 
         dayPrices.push(price.mktcap);
      else{
         date = shortEST(price.date); //next day in data
         dayPrices = [price.mktcap]; //reset dayPrices
      }

      if(uniqueStocks==dayPrices.length){ // average when we have the whole day
         index.push({
            date: date, 
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

//date helper functions
function UTCtoEST(unix){
   var local = tz.convertToLocalTime(unix, {timeZone: 'Etc/GMT'});
   return tz.convertToTimeZone(local, {timeZone: 'US/Eastern'});
}

function short(date){
   return datefns.format(date, 'YYYY-MM-DD');
}

function shortEST(unix){
   return short(UTCtoEST(unix));
}
module.exports = calculate;