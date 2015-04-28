$(document).ready(function(){
	$("[class^='tile-").each(function(index){
		var myclass = $(this).attr('class');
		var splitclass = myclass.split("-");
		var mysize = $("#sizebox").attr('class');
		var dimensions = $("#dimbox").attr('class');
		$(this).css({"width" : mysize, "height" : mysize});
	});

	$("[class^='tile']").click(function(){
		$(this).toggleClass("sqselect");
	});

	$("[class^='tile']").dblclick(function(){
		$("[class^='tile']").removeClass("sqselect");
	});

	$("#zoomIn").click(function(){
		var oldURL = window.location.href;
		var splitURL = oldURL.split('/');
		if(splitURL[splitURL.length-1]==="") splitURL.pop();
		//Change second to last element
		var newzoom = $("#zoomInVal").attr('class');
		splitURL[splitURL.length-2] = newzoom;
		var newURL = "";
		for(var i=0; i<splitURL.length; i++){
			newURL+=splitURL[i]+"/";
		}
		window.location.replace(newURL);
	});

	$("#zoomOut").click(function(){
		var oldURL = window.location.href;
		var splitURL = oldURL.split('/');
		if(splitURL[splitURL.length-1]==="") splitURL.pop();
		//Change second to last element
		var newzoom = $("#zoomOutVal").attr('class');
		splitURL[splitURL.length-2] = newzoom;
		var newURL = "";
		for(var i=0; i<splitURL.length; i++){
			newURL+=splitURL[i]+"/";
		}
		window.location.replace(newURL);
	});

	$("#goUp").click(function(){
		var oldURL = window.location.href;
		var splitURL = oldURL.split('/');
		if(splitURL[splitURL.length-1]==="") splitURL.pop();
		//Get old location
		var oldPos = splitURL[splitURL.length-1];
		var splitPos = oldPos.split('x');
		var newY = $("#upVal").attr('class');
		var newPos = splitPos[0]+"x"+newY;
		//Change last element
		splitURL[splitURL.length-1] = newPos;
		var newURL = "";
		for(var i=0; i<splitURL.length; i++){
			newURL+=splitURL[i]+"/";
		}
		window.location.replace(newURL);
	});

	$("#goDown").click(function(){
		var oldURL = window.location.href;
		var splitURL = oldURL.split('/');
		if(splitURL[splitURL.length-1]==="") splitURL.pop();
		//Get old location
		var oldPos = splitURL[splitURL.length-1];
		var splitPos = oldPos.split('x');
		var newY = $("#downVal").attr('class');
		var newPos = splitPos[0]+"x"+newY;
		//Change last element
		splitURL[splitURL.length-1] = newPos;
		var newURL = "";
		for(var i=0; i<splitURL.length; i++){
			newURL+=splitURL[i]+"/";
		}
		window.location.replace(newURL);
	});

	$("#goLeft").click(function(){
		var oldURL = window.location.href;
		var splitURL = oldURL.split('/');
		if(splitURL[splitURL.length-1]==="") splitURL.pop();
		//Get old location
		var oldPos = splitURL[splitURL.length-1];
		var splitPos = oldPos.split('x');
		var newX = $("#leftVal").attr('class');
		var newPos = newX+"x"+splitPos[1];
		//Change last element
		splitURL[splitURL.length-1] = newPos;
		var newURL = "";
		for(var i=0; i<splitURL.length; i++){
			newURL+=splitURL[i]+"/";
		}
		window.location.replace(newURL);
	});

	$("#goRight").click(function(){
		var oldURL = window.location.href;
		var splitURL = oldURL.split('/');
		if(splitURL[splitURL.length-1]==="") splitURL.pop();
		//Get old location
		var oldPos = splitURL[splitURL.length-1];
		var splitPos = oldPos.split('x');
		var newX = $("#rightVal").attr('class');
		var newPos = newX+"x"+splitPos[1];
		//Change last element
		splitURL[splitURL.length-1] = newPos;
		var newURL = "";
		for(var i=0; i<splitURL.length; i++){
			newURL+=splitURL[i]+"/";
		}
		window.location.replace(newURL);
	});
});