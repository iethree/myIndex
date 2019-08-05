//fetch-stocks
require('dotenv').config();
const request = require('request');
const querystring=require('querystring');
const db = require('./db');

console.log("Starting fetch-stocks at "+new Date());

//fetch daily prices
setTimeout(fetchAllPrices, 2000);
// setTimeout(()=>{
// 	//save all symbols to db
// 	fetchSymbolList(saveSymbolList);
// }, 2000);
setTimeout(process.exit, 90*1000);

//fetch 100 at a time (API limit), then save to DB
async function fetchAllPrices(){

	var symbols = await getSymbols();

	for(var cnt=100; cnt<symbols.length; cnt+=100){
		console.log('requesting: '+cnt);
		
		//make API request, and save to DB
		let prices = await fetchPrices(symbols.slice(cnt-100, cnt));
		savePrices(prices);
	}
	cnt-=100;
	console.log('requesting: '+cnt);
	let prices = await fetchPrices(symbols.slice(cnt, symbols.length));//save last batch of less than 100
	savePrices(prices);
}

//get symbols from DB
async function getSymbols(){
	return new Promise((resolve, reject)=>{

		var query = "SELECT symbol FROM symbols WHERE type='cs' OR type='et'";
		
		db.query(query, function(err, results, fields){	
			if (err) reject (err);
			if(results){
				console.log('symbols ', results.length);
				resolve(results.map(el=>el.symbol));
			}	
		});
	});
}

//get data from IEX
async function fetchPrices(symbols, callback){
	return new Promise((resolve, reject)=>{
		var types = 'quote';
		var filter = "symbol,latestUpdate,latestPrice,marketCap";
		var symbolstring = symbols.join(',');

		var query = 'https://cloud.iexapis.com/stable/stock/market/batch?'+
		querystring.stringify({
			token: process.env.IEX_PUBLIC,
			symbols: symbolstring,
			types: types,
			filter: filter
		});

		console.log('fetching', symbols.length, symbols[0]);

		request.get(query, (error, response, body)=>{
			
			if(error)
				console.log('fetch error',error);
			else{
				try{
					resolve(JSON.parse(body));
				}catch(e){
					console.log('parse error');
					console.log('query', query);
					console.log(body);
				}
			}
		});
	}).catch(console.log);
}

//save API data to DB
function savePrices(priceData){

	console.log('saving', Object.keys(priceData).length);
	
	var priceValues = [];
	for(let cnt in priceData){
		if(priceData[cnt].quote && priceData[cnt].quote.latestUpdate){
			priceValues.push([
				priceData[cnt].quote.latestUpdate, 
				priceData[cnt].quote.symbol, 
				priceData[cnt].quote.latestPrice, 
				priceData[cnt].quote.marketCap
			]);
		}
	}
		
	var query = "INSERT INTO prices (date, symbol, price, mktcap) VALUES ? ON DUPLICATE KEY UPDATE symbol=symbol";
	
	if(priceValues.length){
		db.query(query, [priceValues], function(err, results, fields){
			if (err) console.log(err);
			console.log(results.message.slice(1,results.message.length));
		});
	}	
}




//get symobls from IEX
function fetchSymbolList(callback){
	
	console.log("fetching symbol list");
	
	request.get('https://cloud.iexapis.com/stable/ref-data/symbols?token='+process.env.IEX_PUBLIC,
		function(error, response, body){

		console.log("got symbol list");
		try{
			callback(JSON.parse(body));
		}
		catch(er){
			console.log(body);
			console.log('parse error', e);
		}
	});
}

function saveSymbolList(results){
	
	var query = "INSERT INTO symbols (symbol, name, type) VALUES ? ON DUPLICATE KEY UPDATE symbol=symbol";	
	var alldata = results.map((i)=>{return [i.symbol, i.name, i.type]});
	
	db.query(query, [alldata], function(err, results, fields){
		if (err)	throw err;
		console.log(results.message);
	});
}
