//fetch-stocks
require('dotenv').config();
var request = require('request');
var schedule = require('node-schedule');
var dbserver = require('mysql');

var stockUpdateSchedule = new schedule.RecurrenceRule();
	stockUpdateSchedule.hour = 21;
	stockUpdateSchedule.minute = 33;

var priceUpdater = schedule.scheduleJob(stockUpdateSchedule, function(){
	
	fetchAllPrices();

});

var db = dbserver.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: 'myindex'
});

//keep connection alive by querying every minute

setInterval(function () {
    db.query('SELECT 1');
}, 60*1000);

console.log("Starting fetch-stocks at "+new Date());
//get data from IEX
function fetchPrices(symbols, callback){
	
	var types = 'quote';
	var filter = "symbol,latestUpdate,latestPrice,marketCap";
	var symbolstring = symbols.join(',');
	
	request.get('https://api.iextrading.com/1.0/stock/market/batch?symbols='+symbolstring+'&types='+types+'&filter='+filter, 
		function(error, response, body){
		
		if(error)
			console.log(error);
		else
			callback(JSON.parse(body));
		
	});
}

//get symobls from IEX
function fetchSymbolList(callback){
	
	console.log("fetching symbol list");
	
	request.get('https://api.iextrading.com/1.0/ref-data/symbols', 
		function(error, response, body){
		
		console.log("got symbol list");
		callback(JSON.parse(body));
	});
}
/*
CREATE TABLE prices (
	date BIGINT NOT NULL,
	symbol VARCHAR(10) NOT NULL,
	price FLOAT,
	mktcap DOUBLE,
	UNIQUE(date, symbol)
);

CREATE TABLE indexes(
	name VARCHAR(160) UNIQUE NOT NULL,
	description VARCHAR(240) NOT NULL,
	symbols VARCHAR(20000) NOT NULL
);

*/
function getSymbols(callback){
	console.time('get symbols');
	
	var query = "SELECT * FROM symbols WHERE type='cs' OR type='et'";
		
	db.query(query, function(err, results, fields){
			
		if (err)
			throw err;
		
		console.log(results.length+" symbols found");
		console.timeEnd('get symbols');
		callback(results);

	});
}

function savePrices(priceData){

	var priceValues = [];
	
	for(var cnt in priceData){

		if(priceData[cnt].quote){
			priceValues.push( [priceData[cnt].quote.latestUpdate, priceData[cnt].quote.symbol, priceData[cnt].quote.latestPrice, priceData[cnt].quote.marketCap]);
			
		}
	}
		
	var query = "INSERT INTO prices (date, symbol, price, mktcap) VALUES ? ON DUPLICATE KEY UPDATE symbol=symbol";
	if(priceValues.length){
		db.query(query, [priceValues], function(err, results, fields){
			
		if (err)
			throw err;
		
		//console.log(results.message);

		});
	}	
}

function fetchAllPrices(){

	getSymbols(function(results){ //get all symbols from DB
		
		var requestBatch=[];
		
		for(cnt=0; cnt<results.length; cnt++){
			
			requestBatch.push(results[cnt].symbol);
			
			if(cnt!=0 && cnt%100==0){ //fetch 100 at a time
				//console.log('requesting: '+cnt);
				
				//make API request, and save to DB
				fetchPrices(requestBatch, savePrices);
				
				//reset batch
				requestBatch=[];
			}
		}
		//console.log('requesting: '+cnt);
		fetchPrices(requestBatch, savePrices);//save last batch of less than 100
		//db.end();
	});
}


//fetch daily prices

//fetchAllPrices();
//setTimeout(function(){process.exit();}, 30*1000);

//save all symbols to db
//fetchsymbolList(saveSymbolList);

function saveSymbolList(results){
	
	console.time('dbsave');
	query = "INSERT INTO symbols (symbol, name, type) VALUES ?";
			
	var alldata = [];
	
	for(cnt=0;cnt<results.length; cnt++){
		
		alldata[cnt]=[results[cnt].symbol, results[cnt].name, results[cnt].type];
	}
	
	db.query(query, [alldata], function(err, results, fields){
			
		if (err)
			throw err;
	
		console.log(results.message);
		console.timeEnd('dbsave');
	});
}


