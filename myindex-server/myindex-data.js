const db = require("./db.js");
const log = require('./log.js');

/**
 * gets a single symbol's data
 * 
 * @param {string} symbol stock symbol
 * @param {number} duration days of prices
 * @returns {promise} resolves data or rejects error
 */
exports.getSymbol =  async (symbol, duration = 90)=>{
   let query = `select * from prices where symbol="${symbol}" LIMIT ${duration}`;

   return db(query);
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
   return db(query);
}
/**
 * returns list of all symbols currenly in the database
 * 
 * @returns {promise} resolves array of symbol objects or rejects error
 */
exports.getSymbolList = async ()=>{
   let query = "select * from symbols";
   return db(query);
}

/**
 * saves a new index
 * 
 * @param {string} name new custom index name
 * @param {array} symbols array string symbols
 */
exports.saveIndex = async (name, symbols)=>{
   let query = `INSERT INTO indexes (name, symbols) VALUES ('${name}','${symbols.join(',')}') ON DUPLICATE KEY UPDATE symbols=VALUES(symbols)`;
   return db(query);
}

exports.getIndexList = async()=>{
   let query = `select * from indexes`;
   return db(query);
}

exports.getIndexData = async(name, duration = 90)=>{
   let query = `return * from indexData WHERE name=${name} LIMIT ${duration}`;
   return db(query);
}
