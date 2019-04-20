//makeindex-client

//button bindings.

	//check if valid and change icon
	$('#newstock').on('keyup', function(e){
		
		if (e.keyCode == 13) { //if user hits enter, try to add stock
			addHandler();
		}
		else{
			input=$('#newstock').val();
			
			if(input=='')
				result='';
			else if (isValidStock(input))
				result="fa fa-check";
			else
				result="fa fa-close";
			
			$('#validcheck').removeClass().addClass(result);
		}
	});

	//add button
	$("#add").click(function(){
		
		addHandler();
			
	});
	
	function addHandler(){
		
		$("#add").addClass("is-loading");
		console.log("begin add");
				
		//get the stock data into the object, returning only the newly added symbols
		added=currentIndex.addSymbols($('#newstock').val());
		
		
		added.then(function(validStockArray){
			
			for (i in validStockArray){
				
				makeTag(validStockArray[i]);
			}
			
			//clear input
			$("#newstock").val('');
			$("#newstock").val('');
			$("#newstock").typeahead('val', '');
			$('#newstock').typeahead('close');
			
			updateChart(myChart, indexes);
			
			console.log("end add");
			$("#add").removeClass("is-loading");
		
		});
		
		
	}
	
	function makeTag(symbol){
	
		//create visual tags to display
		colorOptions = ["dark","primary","info","success","warning","danger"];
		
		var newtag =
			'<div class="control"><div id=tag-'+symbol+' class="tags has-addons animated fadeIn">'+
			  '<span class="tag tooltip is-'+colorOptions[Math.floor(Math.random()*colorOptions.length)]+'" data-tooltip="'+getStockName(symbol)+'">'+symbol+'</span>'+
			  '<a class="tag is-delete"></a>'+
			'</div></div>';
				
		$("#taglist").append(newtag);
	}
		
	
	//save
	$("#save").click(function(){
		
		$(".modal").toggleClass('is-active');
			
	});
	
	$(".modal-background").click(function(){
		
		$(".modal").toggleClass('is-active');
			
	});
	
	$("#save2").click(function(){
		
		currentIndex.title=$("#indexName").val();
		var stocklist = Object.keys(currentIndex.stockData).join(',');
		
		if(currentIndex.title=='' || stocklist==''){
			
			$('#indexName').addClass('animated bounce');
			
		}
		else{
			
			$("#save2").addClass('is-loading');
			
			console.log("saving "+currentIndex.title+" : "+stocklist);
			
			saveIndex(currentIndex.title, stocklist, function(){
				
				$("#save2").removeClass('is-loading').html('saved').addClass('is-success');
				
				setTimeout(function(){
					$(".modal").toggleClass('is-active');
					$("#save2").html('save').removeClass('is-success');
					
				}, 1000);
			});			
		}
	});
	

	//remove X
	$("#taglist").on("click", '.is-delete', function(){
		
		//remove from array
		var toRemove = $(this).parent().attr('id').replace('tag-','');
		
		console.log("removing: "+toRemove);
		currentIndex.removeStock(toRemove);
		
		
		//remove tag
		$(this).parent().parent().remove();
		
		updateChart(myChart,indexes);
			
	});

	//update index name on entering it into the box
	$("#indexname").on("focusout", function(){
		
		currentIndex.setName($("#indexname").val());
			
	});

	//remove the error message when clicking the X
	$("#errormsg").on("click", '.delete', function(){
		
		$(this).parent().remove();
			
	});
	
	
function createTypeahead(){
	
	var typeaheadStocks = [];
	
	//form into array of objects for typaehead
	for (var i=0; i<stocks.symbols.length; i++){
		typeaheadStocks.push({symbol: stocks.symbols[i], display: stocks.symbols[i]+" - "+stocks.names[i]});
	}
	
	// constructs the suggestion engine
	var stockSearch = new Bloodhound({
	  datumTokenizer: Bloodhound.tokenizers.whitespace,
	  queryTokenizer: Bloodhound.tokenizers.whitespace,
	  local: stocks.combos
	});

	//bind typeahead
	$('#newstock').typeahead(
	 {
	   hint: true,
	   highlight: true,
	   minLength: 1
	 },
	 {
	   name: 'stockSearch',
	   display: (s)=>{
		return s.split(' - ')[0];
	   },
	   source: stockSearch,
	   templates: {
		 suggestion: function (data) {
		 	return '<p>'+ data +'</p>';
		 }
	   }
	 }
	);
}


function errorMsg(text){
	
	console.log("error: "+text);
	
	id="errormsg"+getRandomInt(1,10000);
	
	duration=3000;
		
	$("#errorMsg").append(
		'<div id="'+id+'" class="notification is-danger temporary">'+
		  '<button class="delete"></button>'+
		  text+
		'</div>');
	$("#"+id).toggle("show");
	
	//remove after 3s - bug won't remove if 2 visible at the same time
	setTimeout( function(){
		$("#"+id).toggle("show");
		console.log("hide "+id);
	}, duration);
	
	setTimeout( function(){
		$("#"+id).remove();
		console.log("remove "+id);
	}, duration+300);
}
//main

getSymbols(function(results){
	
	results.forEach(function(i){
		stocks.symbols.push(i.symbol);
		stocks.names.push(i.name);
		stocks.combos.push(i.symbol+" - "+i.name);
	});
	
	createTypeahead();
});

var ctx = document.getElementById("chart").getContext('2d');
myChart = new Chart(ctx, {
	type:'line',
	fill: 'false'	
});

indexes = [];
currentIndex = new myIndex();
indexes[0]= currentIndex;
