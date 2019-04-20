require('dotenv').config();
var express = require('express');
var router = express.Router();

var dbserver = require('mysql');

var db = dbserver.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: 'myindex'
});

//keep connectoin alive
setInterval(function () {
    db.query('SELECT 1');
}, 60*1000);


router.get('/getSymbol/:symbol/:duration?', function (req, res, next){
	
	query = "select * from prices where symbol='"+req.params.symbol+"' LIMIT "+(req.params.duration || 90);
	
	db.query(query, function(err, results, fields){
			
		if (err)
			throw err;
		if(results.length){
			
			res.status(200).send(results);
		}
		else{
			res.status(200).send({'status':'invalid symbol'});
		}
	});
});

router.get('/getSymbols/:symbols/:duration?', function (req, res, next){
	
	var numsymbols = req.params.symbols.split(',').length;
	var symbolList= req.params.symbols.split(',').join("','");
	
	query = "select * from prices where symbol IN ('"+symbolList+"') "+" ORDER BY date DESC LIMIT "+(req.params.duration || 90)*numsymbols;
	
	db.query(query, function(err, results, fields){
			
		if (err)
			throw err;
		if(results.length){
			
			res.status(200).send(results);
		}
		else{
			res.status(200).send({'status':'invalid symbol'});
		}
	});
});

router.get('/getSymbolList', function (req, res, next){
	
	query = "select * from symbols";
	
	db.query(query, function(err, results, fields){
			
		if (err)
			throw err;
		if(results.length){
			
			res.status(200).send(results);
		}
		else{
			res.status(200).send({'status':'error'});
		}
	});
});

router.get('/myindex', function (req, res, next){
	
	res.render('myIndex-body', {
		title: 'Make Index'
	});
});

router.get('/about', function (req, res, next){
	
	res.render('myIndex-about', {
		title: 'About'
	});
});

router.get('/', function (req, res, next){
	
	
	query = "SELECT * FROM indexes LIMIT 20";
	
	db.query(query, function(err, results, fields){
			
		if (err)
			throw err;
		
		res.render('myIndex-home', {
			title: '',
			indexes: results
		});
	});
	
	
});

router.get('/browse', function (req, res, next){
	
	query = "SELECT * FROM indexes";
	
	db.query(query, function(err, results, fields){
			
		if (err)
			throw err;
		res.render('myIndex-browse-body', {
			title: 'Browse Indexes',
			indexes: results
		});
	});

});

router.post('/saveIndex', function (req, res, next){
	
	query = "INSERT INTO indexes (name, symbols) VALUES ('"+req.body.name+"','"+req.body.symbols+"') ON DUPLICATE KEY UPDATE symbols=VALUES(symbols)";
	
	
	db.query(query, function(err, results, fields){
			
		if (err)
			throw err;
		if(results.length){
			
			res.status(200).send({'status':'success'});
		}
		else{
			res.status(200).send({'status':'error'});
		}
	});
});

module.exports = router;
