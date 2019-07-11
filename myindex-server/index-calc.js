//index-calc.js
const datefns = require('date-fns');
const log = require('./log');

/**
 * calculates index given an array of prices
 * 
 * @param {array} prices array of price objects sorted by date descending
 * @property {number} date a unix timestamp
 * @property {string} symbol 
 * @property {number} mktcap
 * @property {number} price
 * 
 * @returns {array} an array of index price objects
 * @property {number} date
 * @property {number} mktcap
 * 
 */
function calc(prices){
   var numStocks = countStocks(prices);
   var prices = [], dayPrices = [];
   var date = new Date(prices[0].date*1000);

   for (price of prices){
      if(datefns.isSameDay(date, price.date)) //collect all the prices from a day
         dayPrices.push(price.mktcap);
      else{ //when we get to the next day
         prices.push({date: date, mktcap: average(numStocks, dayPrices)}) //push in average

         date = datefns.addDays(date, 1); //next day
         dayPrices = [price]; //reset dayPrices
      }
   }
   return prices;
}

function average(numStocks, dayPrices){
   //make sure numStocks = dayPrices.length
}

module.exports = calc;