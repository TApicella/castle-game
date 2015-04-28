var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var WorldMap = require('../models/Map.js');


/* GET map data. */
router.get('/', function(req, res, next) {
	WorldMap.find(function(err,docs){
		if (err) return next(err);
		res.render('allmaps', {
			"allmaps" : docs
		});
	});
});
/* GET localized data. */
router.get('/:id', function(req, res, next) {
	var size = 5;
	var start = "1x1";
	WorldMap.find({"simpleID" : req.params.id},"simpleID user squares", function(err,docs){
		if (err) return next(err);
		//console.log(docs[0].simpleID);
		var dimensions = (2*size)+1;
		var sqsize = 100/dimensions;
		var sqsizestring = sqsize+"%";
		var allsquares = filterLocation(docs, size, start);
		res.render('map2', {
			"allsquares" : allsquares, "sqsize" : sqsizestring, "dimensions":dimensions
		});
	});
});

/* GET localized data. */
router.get('/:id/:size/', function(req, res, next) {
	var size = req.params.size;
	var start = "1x1";
	WorldMap.find({"simpleID" : req.params.id},"simpleID user squares", function(err,docs){
		if (err) return next(err);
		//console.log(docs[0].simpleID);
		var dimensions = (2*size)+1;
		var sqsize = 100/dimensions;
		var sqsizestring = sqsize+"%";
		var allsquares = filterLocation(docs, size, start);
		res.render('map2', {
			"allsquares" : allsquares, "sqsize" : sqsizestring, "dimensions":dimensions
		});
	});
});

/* GET localized data. */
router.get('/:id/:size/:start/', function(req, res, next) {
	var size = req.params.size;
	var start = req.params.start;
	var id = req.params.id;
	var splitstart = start.split("x");
	var startx = splitstart[0];
	var starty = splitstart[1];
	
	WorldMap.find({"simpleID" : req.params.id},"simpleID user squares", function(err,docs){
		if (err) return next(err);
		//console.log(docs[0].simpleID);
		var dimensions = (2*size)+1;
		var sqsize = 100/dimensions;
		var sqsizestring = sqsize+"%";
		var allsquares = filterLocation(docs, size, start);
		//Make this more robust once maps store their dimensions
		if(startx<1 || starty<1 || size<1){
			if(startx<1) startx=1;
			if(starty<1) starty=1;
			var newstart = startx+"x"+starty;
			if(size<1) size=1;
			var newurl = "/maps/"+id+"/"+size+"/"+newstart+"/";
			res.redirect(newurl);
		}
		else {res.render('map2', {
			"allsquares" : allsquares, "sqsize" : sqsizestring, "dimensions":dimensions,
			"id":id, "size":size, "left":parseInt(startx)-1, "right":parseInt(startx)+1, "up":parseInt(starty)-1, "down":parseInt(starty)+1, "zoomin":parseInt(size)-1, "zoomout":parseInt(size)+1
		});
	}
});
});

function filterLocation(docs, size, start){
	var squares = docs[0].squares[0];
	var splitstart = start.split('x');
	var startX = parseInt(splitstart[0], 10);
	var startY = parseInt(splitstart[1], 10);
	var allX = [];
	var allY = [];
	if(startX<100 && startX>=1) allX.push(startX);
	if(startY<100 && startY>=1) allY.push(startY);
	var allLocations = [];
	for(var i=1; i<=size; i++){
		if(startX+i<100 && startX+i>=1){
			allX.push(startX+i);
			//console.log(startX+i);
		}
		else{ allX.push("w");}

		if(startX-i<100 && startX-i>=1){
			allX.unshift(startX-i);

			//console.log(startX-i);
		}
		else{ allX.unshift("w");}

		if(startY+i<100 && startY+i>=1){
			allY.push(startY+i);
		}
		else{ allY.push("w");}

		if(startY-i<100 && startY-i>=1){
			allY.unshift(startY-i);
		}
		else{ allY.unshift("w");}
	}
	//console.log(allX);
	for(var j=0; j<allY.length; j++){
		for(var k=0; k<allX.length; k++){
			if(allX[k]!="w" && allY[j]!="w"){
				var loc = allX[k]+"x"+allY[j];
				allLocations.push(loc);
			}
			else{
				allLocations.push("w");
			}
		}
	}
	//console.log(allLocations.join(' '));
	var allsquares = [];
	var row = [];
	var counter = 1;
	for(var s in allLocations){
		var sq = allLocations[s];
		if(sq!="w"){
			//console.log(sq);
			row.push(squares[sq]);
		}
		else{
			row.push(sq);
		}
		if(counter%((2*size)+1)===0){
			allsquares.push(row);
			row = [];
		}
		counter++;
	}
	return allsquares;

}

module.exports = router;
