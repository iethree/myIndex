//index-calc tests

var calc = require('./index-calc');
var datefns = require('date-fns');

test('2 stocks 2 days', ()=>{
   var day1 = new Date().getTime();
   var day2 = datefns.addDays(day1, 1).getTime();
   var twoStockPrices = [
      {  
         date: day1,
         symbol: 'AAA',
         mktcap: 100
      },
      {  
         date: day1,
         symbol: 'BBB',
         mktcap: 200
      },
      {  
         date: day2,
         symbol: 'AAA',
         mktcap: 200
      },
      {  
         date: day2,
         symbol: 'BBB',
         mktcap: 300
      }
   ];
   var twoStockIndex = [
      {
         date: day1,
         mktcap: 150
      },
      {
         date: day2,
         mktcap: 250
      }
   ];

   expect(calc(twoStockPrices)).toStrictEqual(twoStockIndex);
});

test('Bad Data Average', ()=>{
   var day1 = new Date().getTime();
   var day2 = datefns.addDays(day1, 1).getTime();
   var badData = [
      {  
         date: day1,
         symbol: 'AAA',
         mktcap: 100
      },
      {  
         date: day1,
         symbol: 'CCC',
         mktcap: 200
      },
      {  
         date: day2,
         symbol: 'AAA',
         mktcap: 200
      },
      {  
         date: day2,
         symbol: 'BBB',
         mktcap: 300
      }
   ];
   var emptyIndex = [ ];

   expect(calc(badData)).toStrictEqual(emptyIndex);
});

test('Half Bad Data Average', ()=>{
   var day1 = new Date().getTime();
   var day2 = datefns.addDays(day1, 1).getTime();
   var halfBadData = [
      {  
         date: day1,
         symbol: 'AAA',
         mktcap: 100
      },
      {  
         date: day1,
         symbol: 'BBB',
         mktcap: 200
      },
      {  
         date: day2,
         symbol: 'AAA',
         mktcap: 200
      }
   ];
   var halfIndex = [
      {
         date: day1,
         mktcap: 150
      }
   ];

   expect(calc(halfBadData)).toStrictEqual(halfIndex);
});

test('test 5 days of 5 stock prices', ()=>{
   var [prices, index] = makeSimpleIndex(5, 5);
   expect (calc(prices)).toStrictEqual(index);
});
test('test 50 days of 50 stock prices', ()=>{
   var [prices, index] = makeSimpleIndex(50, 50);
   expect (calc(prices)).toStrictEqual(index);
});
test('test 50 days of 50 stock prices with error', ()=>{
   var [prices, index] = makeSimpleIndex(50, 50);
   prices[0].mktcap=0;
   expect (calc(prices)).not.toStrictEqual(index);
});
test('test 50 days of 50 stock prices with 1 popped', ()=>{
   var [prices, index] = makeSimpleIndex(50, 50);
   prices.pop();
   index.pop();
   expect (calc(prices)).toStrictEqual(index);
});

function makeSimpleIndex(symbols, days){
   var prices = [], index=[];
   var date = new Date().getTime();
   for(let d=1; d<=days; d++){
      date = datefns.subDays(date, 1);
      index.push({date: Math.round(date.getTime()/1000), mktcap: d*100});

      for(let s=1; s<=symbols; s++){
         prices.push({
            date: date.getTime()/1000,
            symbol: "stock_"+s,
            mktcap: d*100
         });
      }
   }
   return [prices, index];
}