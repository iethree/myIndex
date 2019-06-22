//browse-client

//button bindings.
var indexes = [];

$(document).ready(function(){
	
	getSymbols(function(results){
		
		results.forEach(function(i){
			stocks.symbols.push(i.symbol);
			stocks.names.push(i.name);
			stocks.combos.push(i.symbol+" - "+i.name);
			
		});
		
		var samples = $('#samples').children();
		var first = true;
		for(cnt=0; cnt<$(samples).length; cnt++){
			
			indexes[cnt] = new myIndex();
			indexes[cnt].setName($(samples[cnt]).attr('name'));
			indexes[cnt].addSymbols($(samples[cnt]).attr('data')).then(function(){
				
				//loading bar
				var progress = Number($(".progress").attr('value'));
				progress+=100/samples.length;
				$(".progress").attr('value', progress);
				
				if(progress>95){
					$(".progress").addClass("animated fadeOut");
				}
				
				if (first){ //start animation on first iteration
					rotateIndexes();
					first=false;
				}
				
			});	
		}
	});
});

//rotate sample indexes every 3 seconds
function rotateIndexes(){
	updateChart(myChart, [indexes[0]]);
	var cnt=1;
	
	setInterval(function(){
		
		updateChart(myChart, [indexes[cnt]]);
		cnt++;
		
		if(cnt==indexes.length)
			cnt=0;
		
	}, 3000);
	
}
function errorMsg(err){
	
	console.log(err);
}

var ctx = document.getElementById("chart").getContext('2d');
myChart = new Chart(ctx, {
	type:'line',
	
});


