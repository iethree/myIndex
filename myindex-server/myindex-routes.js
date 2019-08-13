var express = require('express');
var router = express.Router();
var data = require('./myindex-data.js');

router.get('/data/symbols/:symbols/:duration?', (req, res, next)=>{
	var symbols;
	if(req.params.symbols.includes(','))
		symbols = req.params.symbols.split(',');
	else
		symbols = req.params.symbols;

	data.getSymbols(symbols, req.params.duration)
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(400));
});

router.get('/data/symbolList', (req, res, next)=>{
	data.getSymbolList()
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(400));
});

router.post('/data/index', (req, res, next)=>{
	data.saveIndex(req.body.name, req.body.symbols)
	.then(result=>res.send(result).status(201))
	.catch(err=>res.send(err).status(400));
});
 
router.get('/data/indexes', (req, res, next)=>{
	data.getIndexList()
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(400));
});

router.get('/data/index/:name/:duration?', (req, res, next)=>{
	data.getIndexData(req.params.name, req.params.duration)
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(400));
});

router.delete('/data/index/:name', (req, res, next)=>{
	data.deleteIndex(req.params.name)
	.then(result=>res.send(result).status(200))
	.catch(err=>res.send(err).status(400));
});


// catchall, must be last 
router.get('*', (req,res) =>{
	res.sendFile(__dirname+'/public/index.html');
});

module.exports = router;
