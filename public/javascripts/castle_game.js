$(document).ready(function(){
	$("[class^='tile-").each(function(){
		var myclass = $(this).attr('class');
		var splitclass = myclass.split("-");
		var mysize = $("#sizebox").attr('class');
		$(this).css({"width" : mysize, "height" : mysize});
	});
});