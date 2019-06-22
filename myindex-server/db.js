//database
require('dotenv').config();
const dbserver = require('mysql');
const log = require ('./log.js');

var db = dbserver.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: 'myindex'
});

db.connect((err)=>{
	if (err) log.err('database connection error');
	else 		log.success('databse connection established');
 });

//keep connection alive
setInterval(function () {
    db.query('SELECT 1');
}, 60*1000);

module.exports = db;