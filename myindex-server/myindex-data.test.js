//myindex-data tests

const data = require('./myindex-data');

test('create new index', async ()=>{
   var value = await data.saveIndex('newIndex', ['aapl', 'goog'])
   expect(value.status).toBe(true);
});

test('calculate index prices for 10 days', async()=>{
   var result = await data.saveIndexData('newIndex', 10);
   expect(result.status).toBe(true);
   expect(result.data.affectedRows).toBe(10);
});

test('get 10 index prices', async()=>{
   var dataResult = await data.getIndexData('newIndex', 10);
   expect(dataResult.data.length).toBe(10); 
   expect(dataResult.data[0].name).toBe('newIndex');
});

test('delete new index', async()=>{
   var deleteResult = await data.deleteIndex('newIndex');

   expect(deleteResult.status).toBe(true);
   expect(deleteResult.data).toBe(10);
});