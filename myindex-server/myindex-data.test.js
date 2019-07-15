//myindex-data tests

const data = require('./myindex-data');

test('create new index', async ()=>{
   var value = await data.saveIndex('newIndex', ['aapl', 'goog'])
   expect(value.status).toBe(true);
});

test('calculate index prices for 10 days', async()=>{
   var result = await data.saveIndexData('newIndex', 10);
   expect(results.status).toBe(true);
   console.log(result);
   result = await data.getIndexData('newIndex', 10);
   expect(result.data.length).toBe(10); 
});