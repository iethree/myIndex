//create tables
const db = require('./db');

function createIndexData(){
   let query = `CREATE TABLE indexData(
      name varchar(255),
      date bigint,
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

//wait a second for db to connect
setTimeout(()=>{
   createIndexData();
}, 1000);