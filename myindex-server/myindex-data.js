var db = require("./db.js");
var log = reqire('./log.js');

/**
 * gets a single symbol's data
 * 
 * @param {string} symbol stock symbol
 * @param {number} duration days of prices
 * @returns {promise} resolves data or rejects error
 */
export async function getSymbol(symbol, duration = 90){
   var query = `select * from prices where symbol="${symbol}" LIMIT ${duration}`;

   return query(query);
}

/**
 * gets data for multiple symbols
 * 
 * @param {array} symbols array of symbol strings
 * @param {number} duration days of prices
 * @returns {promise} resolves data or rejects error
 */
export async function getSymbols(symbols, duration = 90){
	var symbolList= symbols.join("','");
   var query = `select * from prices where symbol IN ('${symbolList}') ORDER BY date DESC LIMIT ${(duration*symbols.length)}`;
   return query(query);
}
/**
 * returns list of all symbols currenly in the database
 * 
 * @returns {promise} resolves array of symbol objects or rejects error
 */
export async function getSymbolList(){
   var query = "select * from symbols";
   return query(query);
}

/**
 * saves a new index
 * 
 * @param {string} name new custom index name
 * @param {array} symbols array string symbols
 */
export async function saveIndex(name, symbols){
   var query = `INSERT INTO indexes (name, symbols) VALUES ('${name}','${symbols.join(',')}') ON DUPLICATE KEY UPDATE symbols=VALUES(symbols)`;
   return query(query);
}

export async function getIndexList(){
   var query = `select * from indexes`;
   return query(query);
}

export async function getIndexData(name, duration = 90){
   var query = `return * from indexData WHERE name=${name} LIMIT ${duration}`;
   return query(query)
}

/**
 * helper function to make database queries
 * 
 * @param {string} query mysql query string
 * @returns {promise} resolves data or rejects error
 */
async function query(query){
   return new Promise((resolve, reject)=>{
      db.query(query, function(err, results, fields){
         if (err)            reject({status: false, message: err});
         if (results.length) resolve({status: true, data: results})
         else                reject({status: false});
      });
   });
}