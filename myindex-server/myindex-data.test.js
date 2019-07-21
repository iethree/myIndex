//myindex-data tests

const data = require('./myindex-data');
const DAYS = 90;

test('create new index', async ()=>{
   var value = await data.saveIndex('newIndex', ['aapl', 'goog'])
   expect(value.status).toBe(true);
});

test(`calculate index prices for ${DAYS} days`, async()=>{
   var result = await data.saveIndexData('newIndex', DAYS);
   expect(result.status).toBe(true);
   expect(result.data.affectedRows).toBe(DAYS);
});

test(`get ${DAYS} index prices`, async()=>{
   var dataResult = await data.getIndexData('newIndex', DAYS);
   expect(dataResult.data.length).toBe(DAYS); 
   expect(dataResult.data[0].name).toBe('newIndex');
});

test('delete new index', async()=>{
   var deleteResult = await data.deleteIndex('newIndex');

   expect(deleteResult.status).toBe(true);
   expect(deleteResult.data).toBe(DAYS);
});

describe('index integrity tests', ()=>{
   data.getIndexList()
   .then((indexList)=>{
      for (let index of indexList.data){
         test(`${index.name} integrity for ${DAYS} days`, async()=>{
            let priceData = await exports.getSymbols(index.symbols.split(','), DAYS);
            expect(priceData.status).toBe(true);
            expect(priceData.data.length).toBe(DAYS);
         });
      }
   });
});


// test(`backfill existing indexes for ${DAYS} days`, async()=>{

//    var indexList = await data.getIndexList();
//    expect(indexList.status).toBe(true);

//    for (let index of indexList.data){
//       var result = await data.saveIndexData(index.name, DAYS);
//       console.log(index.name, result.data && result.data.message ? result.data.message : result.data);
//    }
// });