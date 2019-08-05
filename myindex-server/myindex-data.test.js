//myindex-data tests

const data = require('./myindex-data');
const _ = require('lodash');
const DAYS = 30;

test('create new index', async ()=>{
   var value = await data.saveIndex('newIndex', ['aapl', 'goog'])
   expect(value.status).toBe(true);
});

test(`calculate index prices for ${DAYS} days`, async()=>{
   var result = await data.saveIndexData('newIndex', DAYS);
   expect(result.status).toBe(true);
   console.log(result.data.affectedRows);
   expect(result.data.affectedRows).toBeTruthy();
});

test(`get ${DAYS} index prices`, async()=>{
   var dataResult = await data.getIndexData('newIndex', DAYS);
   expect(dataResult.data.length).toBeTruthy(); 
   expect(dataResult.data[0].name).toBe('newIndex');
});

test('delete new index', async()=>{
   var deleteResult = await data.deleteIndex('newIndex');

   expect(deleteResult.status).toBe(true);
   expect(deleteResult.data).toBeTruthy();
});

test('check index', async()=>{
   var index = await data.getIndex('S&P 500 (manual)');
   var priceData = await data.getSymbols(index.data[0].symbols.split(','), DAYS);
   var counts = _.countBy(priceData.data, 'symbol');

   console.log(counts)
   expect(counts).toBeTruthy();
});



// test(`backfill existing indexes for ${DAYS} days`, async()=>{

//    var indexList = await data.getIndexList();
//    expect(indexList.status).toBe(true);

//    for (let index of indexList.data){
//       var result = await data.saveIndexData(index.name, DAYS);
//       console.log(index.name, result.data && result.data.message ? result.data.message : result.data);
//    }
// });