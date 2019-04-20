//browse-client

//button bindings.
$('#listToggle').click((e)=>{
	$('.menu-list').toggleClass('hidden');
	$('#caret').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
});

$('.index-tab').click(function(e){
	
	//toggle active
	$(this).toggleClass('is-active');
	name = $(this).text();
	
	idname = name.replace(/[&*%$#@!,+./\\\(\)\[\]\{\}]/g,'');
	idname = idname.replace(/\s/g,'');
	
	if($(this).hasClass('is-active')){
		//add to chart
		symbols = $(this).attr('data');
		
		newIndex = new myIndex();
		indexes.push(newIndex);
		newIndex.setName(name);
		
		//create index
		newIndex.addSymbols(symbols).then(function(){
			
			updateChart(myChart, indexes);
		});
		
		//show symbol list
		
		
		$("#taglist").append(
			"<div class='box' id='tags-"+idname+"''>"+
				"<h6 class = 'title is-6'>"+name+"</h6>"+
				"<div id='taglist-"+idname+"' class='tags'> </div>"+
			"</div>");
		
		var symbolList = symbols.replace(/\s/g,'').split(',');

		for(cnt=0; cnt<symbolList.length; cnt++){
			
			makeTag($("#taglist-"+idname+""), symbolList[cnt]);
		}

	}
	else{
		//remove from chart
	
		for(cnt=0; cnt<indexes.length; cnt++){
			
			if(name==indexes[cnt].title){
				console.log("removing "+name);
				indexes.splice(cnt,1);
				updateChart(myChart, indexes);
				break;
			}
		}
		
		$("#tags-"+idname+"").remove();
	}
});

function errorMsg(err){
	
	console.log(err);
}

function makeTag(div, symbol){

	//create visual tags to display
	colorOptions = ["dark","primary","info","success","warning","danger"];
	
	var newtag =
		'<span id=tag-'+symbol+' class="tag tooltip is-'+colorOptions[Math.floor(Math.random()*colorOptions.length)]+'" data-tooltip="'+getStockName(symbol)+'">'+symbol+
		'</span>';
	
	$(div).append(newtag);
}

getSymbols(function(results){
	results.forEach(function(i){
		stocks.symbols.push(i.symbol);
		stocks.names.push(i.name);
		stocks.combos.push(i.symbol+" - "+i.name);
	});
	
	console.log("got symbols");
});

var ctx = document.getElementById("chart").getContext('2d');
myChart = new Chart(ctx, {
	type:'line',
	
});

indexes = [];
