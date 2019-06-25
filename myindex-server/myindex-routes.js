
var express = require('express');
var router = express.Router();
var data = require('./myindex-data.js');

router.post('data/getSymbolData/:symbol/:duration?', (req, res, next)=>{
	
	query = "select * from prices where symbol='"+req.params.symbol+"' LIMIT "+(req.params.duration || 90);
	
	data.getSymbol(req.params.symbol, req.params.duration)
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(200));
});

router.post('data/getSymbolsData/:symbols/:duration?', (req, res, next)=>{
	
	data.getSymbols(req.params.symbols.split(','), duration)
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(200));
});

router.post('data/getSymbolList', (req, res, next)=>{
	data.getSymbolList()
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(200));
});

router.post('data/saveIndex', (req, res, next)=>{
	data.saveIndex(req.body.name, req.body.symbols)
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(200));
});

router.post('data/getIndexList', (req, res, next)=>{
	data.getIndexList()
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(200));
});

router.post('data/getIndexData/:name/:duration?', (req, res, next)=>{
	data.getIndexData(req.params.name, req.params.duration)
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(200));
});

// catchall, must be last 
router.get('*', (req,res) =>{
	res.sendFile(__dirname+'/public/index.html');
});

module.exports = router;
