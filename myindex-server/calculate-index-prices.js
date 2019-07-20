//calculate index prices

var data = require('./myindex-data');

async function calculateAllIndexPrices(days=1){
   var indexList = await data.getIndexList();

   for (let index of indexList.data){
      var result = await data.saveIndexData(index.name, days);
      console.log(index.name, result.data && result.data.message ? result.data.message : result.data);
   }
}
setTimeout(()=>{
   calculateAllIndexPrices(180);
}, 1000);
