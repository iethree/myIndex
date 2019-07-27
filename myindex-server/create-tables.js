//create tables
const db = require('./db');
const datefns = require('date-fns');
const tz = require('date-fns-timezone');

function createIndexData(){
   let query = `CREATE TABLE indexData(
      name varchar(255),
      date varchar(16),
      mktcap bigint,
      primary key (name, date)
   )`;
   db.query(query)
   .then((result)=>{
      if(result.status)
         console.log('created indexData table');
      else
         console.log('failed to create indexData table');
   });
}

//add date strings
function addDateStrings(){
 let query = `SELECT date FROM prices`;
 db.query(query)
 .then((result)=>{
   if(result.status){
      for(let price of result.data){
         price.datestring = shortEST(price.date);
      }
      let query = 'INSERT INTO prices ('
      /** TODO not done, maybe not worth doing? */
   }
 });
}

//date helpers
function UTCtoEST(unix){
   var local = tz.convertToLocalTime(unix, {timeZone: 'Etc/GMT'});
   return tz.convertToTimeZone(local, {timeZone: 'US/Eastern'});
}

function short(date){
   return datefns.format(date, 'YYYY-MM-DD');
}

function shortEST(unix){
   return short(UTCtoEST(unix));
}
//wait a second for db to connect
setTimeout(()=>{
   createIndexData();
}, 1000);

