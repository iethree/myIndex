const db = require("./db.js");
const log = require('./log.js');
const calculateIndex = require('./index-calc');

/**
 * gets a single symbol's data
 * 
 * @param {string} symbol stock symbol
 * @param {number} duration days of prices
 * @returns {promise} resolves data or rejects error
 */
exports.getSymbol =  async (symbol, duration = 90)=>{
   let query = `select * from prices where symbol="${symbol}" LIMIT ${duration}`;

   return db.query(query);
}

/**
 * gets data for multiple symbols
 * 
 * @param {array} symbols array of symbol strings
 * @param {number} duration days of prices
 * @returns {promise} resolves data or rejects error
 */
exports.getSymbols =  async (symbols, duration = 90)=>{
	var symbolList= symbols.join("','");
   let query = `select * from prices where symbol IN ('${symbolList}') ORDER BY date DESC LIMIT ${(duration*symbols.length)}`;
   return db.query(query);
}
/**
 * returns list of all symbols currenly in the database
 * 
 * @returns {promise} resolves array of symbol objects or rejects error
 */
exports.getSymbolList = async ()=>{
   let query = "select * from symbols";
   return db.query(query);
}

/**
 * saves a new index
 * 
 * @param {string} name new custom index name
 * @param {array} symbols array string symbols
 */
exports.saveIndex = async (indexName, symbols)=>{
   let query = `INSERT INTO indexes (name, symbols, description) VALUES ('${indexName}','${symbols.join(',')}','') 
   ON DUPLICATE KEY UPDATE symbols=VALUES(symbols)`;
   return db.query(query);
}

exports.saveIndexData = async (indexName, days)=>{
   let query = `SELECT symbols FROM indexes WHERE name='${indexName}'`;
   let indexSymbols = await db.query(query);

   if(!indexSymbols.status){
      reject({status: false, message: 'index not found'});
      return;
   }
   
   indexSymbols = indexSymbols.data[0].symbols;

   let priceData = await exports.getSymbols(indexSymbols.split(','), days);

   if(!priceData.status){
      return({status: false, message: 'error getting prices'});
   }
   let indexPrices = calculateIndex(priceData.data);

   if(!indexPrices.length){
      return({status: false, message: 'error calculating index'});
   }
   //map objects to arrays for query
   let writeData = indexPrices.map(item=>{
      return [indexName, item.date, item.mktcap];
   });
   log.info(writeData[0][0], 'prices:', writeData.length );
   
   query = `INSERT INTO indexdata (name, date, mktcap) VALUES ? ON DUPLICATE KEY UPDATE date=date`;
   
   return db.queryData(query, writeData);
}

exports.getIndexList = async()=>{
   let query = `SELECT * FROM indexes`;
   return db.query(query);
}

exports.getIndexData = async(name, duration = 90)=>{
   let query = `SELECT * FROM indexdata WHERE name='${name}' ORDER BY date DESC LIMIT ${duration}`;
   return db.query(query);
}

exports.deleteIndex = async(name)=>{
   return new Promise(async (resolve, reject)=>{
      let query1 = `DELETE from indexes WHERE name='${name}'`;
      let query2 = `DELETE from indexData WHERE name='${name}'`;

      var results = await Promise.all([db.query(query1), db.query(query2)]);
      
      if(results[0].status && results[1].status)
         resolve({status:true, data: results[1].data.affectedRows });
      else
         reject({status: false});
   });
}
