//database
require('dotenv').config();
const dbserver = require('mysql');
const log = require ('./log.js');
log.debug(process.env.DB_HOST);

var db = dbserver.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: 'myindex'
});

db.connect((err)=>{
   if (err) log.err('database connection error', err);
   else     log.success('databse connection established');
});

 /**
 * helper function to make database queries
 * 
 * @param {string} query mysql query string
 * @returns {promise} resolves data or rejects error
 */
var query= async(query)=>{
   return new Promise((resolve, reject)=>{
      db.query(query, function(err, results, fields){
         if (err)            
            reject({status: false, message: err});
         else if (results) 
            resolve({status: true, data: results})
         else                
            reject({status: false});
      });
   }).catch(log.err);
}

 /**
 * helper function to make database queries with an array of data
 * 
 * @param {string} query mysql query string
 * @param {array} data two-dimensional array of values
 * @returns {promise} resolves data or rejects error
 */
var queryData= async(query, data)=>{
   return new Promise((resolve, reject)=>{
      db.query(query, [data], function(err, results, fields){
         if (err)            
            reject({status: false, message: err});
         else if (results) 
            resolve({status: true, data: results})
         else                
            reject({status: false});
      });
   });
}

var isConnected = async()=>{

};

module.exports = {query: query, queryData: queryData};