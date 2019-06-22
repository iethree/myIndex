
var stocks = { symbols: [], names: [], combos: []};

class myIndex
{

	constructor(symbols=false)
	{
		//public variables
		this.stockData={};
			
		//ends up with .date .price .mktcap
		this.index={};
		this.title="myIndex";
		
		//private variables
		this._period = 30;
		this._factor = 500000000000000000000; //the higher the factor, the lower the index
		
		if(symbols)
			this.addSymbols(symbols);
	}
		
	setPeriod(newPeriod){
	
		this._period = newPeriod;
	
		//handle if we change the period after we have some data already - or maybe always just pull a lot of data but display some of it?
	}
	
	setName(name)
	{
		this.title=name;
	}
	
	getName(){
		return this.title;
		
	}
		
	removeStock(symbol){
	
		if(this.stockData[symbol]==undefined)
			return false;
			
		delete this.stockData[symbol];
				
		this.calculateIndex();
	}
	
	getIndex(){
	
		if(!firstkey(this.stockData))
			return false;
		else
			return this.index;
	
	}
	
	parseSymbolList(newstocks)
	{
		//parse the input into an array of valid stocks
		var newStockArray =[];
		var validStockArray =[];
		
		if(typeof newstocks =="string"){
			newstocks=newstocks.toUpperCase();
			newStockArray=newstocks.split(/[,\s\;\t]/);
		}
		else{
			newStockArray=newstocks;
		}
		
		
		for (var i in newStockArray){
				
			//check if it's a valid stock symbol
			if(!isValidStock(newStockArray[i])){
				//error message
				errorMsg('Invalid stock name: '+newStockArray[i]);
				continue;
			}
			
			//check if it's already been loaded
			if(this.stockData[newStockArray[i]]){
				console.log("duplicate");
				errorMsg("Duplicate stock");
				continue;
			}
			
			validStockArray.push(newStockArray[i]);
		}
		
		if(validStockArray.length==0)
			return false;
		
		return validStockArray;
		
	}
	
	addSymbols(symbols){
	
		//filter out duplicate or invalid
		var validStockArray=this.parseSymbolList(symbols);
		var cache=this;
		
		return new Promise(function(resolve,reject){
				
			if(!validStockArray)
				resolve(false);
			
			var gotPrices = [];
			
			//get prices for each valid stock
			validStockArray.forEach(function(element){
				
				gotPrices.push(getSymbol(element));
			});
		
			//when we've got all the prices, recalculate the index
			Promise.all(gotPrices).then(function(){
				//add all the data to the index object
				gotPrices.forEach(function(element){
					//reformat data before storing
					element.then(function(result){
						
						var newObj ={};
						
						for(var i=0; i<result.length; i++){
							
							newObj[moment(result[i].date).format('YYYYMMDD')] = result[i].mktcap;
						}
						
						cache.stockData[result[0].symbol] = newObj;
					});
				});
				
				
			}).then(function(){
				cache.calculateIndex();
			})
			.then(function(){
				resolve(validStockArray);
			});;
		});
	}

	
	calculateIndex(){
		if(this.stockData=={}){ //if there's no data, abort
			return;
		}
		
		var weight;
		
		for (var day=this._period; day>0; day--){ //for each day
		
			var daykey = moment().subtract(day, 'days').format('YYYYMMDD');
			
			//skip weekends
			var wkday = moment(daykey).format('d');
			if(wkday===0 || wkday == 6)
				continue;
			
			this.index[daykey]=0;
		
			for(var thisStock in this.stockData){ //for each stock
			
				var validdaykey=0;
			
				if(this.stockData[thisStock][daykey]){ //check if data exists for this day
					validdaykey = daykey;
				}
				else{ //check if data exists for prior 5 days
					
					for(var i=1; i<6; i++){
						
						var trykey = moment(daykey, 'YYYYMMDD').subtract(i, "days").format('YYYYMMDD');
						
						if(this.stockData[thisStock][trykey]){ //if there's recent data, store the day and break
							console.log("using "+i+" day old data for "+thisStock+" on "+daykey);
							validdaykey = trykey;
							break;
						}
					}
				}
				
				if(validdaykey===0){
					console.log("not enough data to calculate index for "+thisStock+" on "+daykey);
					//index is probably borked, should remove this symbol **LATER**
				}
				else{
					weight = this.stockData[thisStock][validdaykey] / Object.keys(this.stockData).length / this._factor;
										
					this.index[daykey] += this.stockData[thisStock][validdaykey]*weight;
				}
			}
		}
	}
}



function updateChart(chart, indexes){

	if(!indexes.length){ //if theres no data
		console.log('nodata');

		chart.clear();

	}
	else{ //if there is data

		chart.data.labels=Object.keys(indexes[0].getIndex());
		chart.data.datasets=[];
		colors =[217,48,348,141,204,171,275,31,312];
		
		for(cnt=0;cnt<indexes.length;cnt++){
			
			/*
			chart.options.scales.yAxes.push(
			{
				id: ("axis_"+cnt),
				type:"linear",
				display:true,
				position:"left",
			});
			*/
			randomcolor = colors[getRandomInt(0,colors.length-1)];
			
			chart.data.datasets[cnt]=
			{
				label: indexes[cnt].getName(),
				data:Object.values(indexes[cnt].getIndex()),
				borderColor: 'hsla('+randomcolor+', 71%, 53%, 1)',
				backgroundColor: 'hsla('+randomcolor+', 71%, 53%, 1)',
				fill: false,
				//yAxisID:("axis_"+cnt),
			};
			
		}
		chart.update();
	}
}

//helper functions

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function firstkey (ob) {
    for (var prop in ob) {
        return prop;
    }
}

function isValidStock(symbol){
	
	if(stocks.symbols.indexOf(symbol)>-1)
		return true;
	else
		return false;
}

//get a stock name from a symbol
function getStockName(symbol){
	
	index = stocks.symbols.indexOf(symbol.toUpperCase());
	
	if(index>-1)
		return stocks.names[index];
	else
		return false;
}


//real work functions

function getSymbols(callback){ //get info about all symbols
	
	$.ajax({
		url: "/getSymbolList",
		method:"GET",
		dataType: "json",
		error: function(){console.log("Error: Something went wrong getting symbols");},
		success: callback
	});
}

function getSymbol(symbol){ //get one symbol's price data
	return new Promise(function(resolve,reject){
		
		$.ajax({
			url: "getSymbol/"+symbol,
			method: "GET",
			dataType: "json",
			error: function(){console.log("Error: Something went wrong getting share prices");},
			success: function(result){resolve(result);}
		});
	});
}

function saveIndex(name, symbols, callback){ //get info about all symbols
	
	$.ajax({
		url: "/saveIndex",
		method:"POST",
		data:{name: name, symbols: symbols},
		dataType: "json",
		error: function(){console.log("Error saving index");},
		success: callback
	});
}


