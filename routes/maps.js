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
	var size = 10;
	var start = "1x1";
	WorldMap.find(function(err,docs){
		if (err) return next(err);
		var allsquares = filterLocation(docs, id, size, start);
		res.render('map', {
			"allsquares" : allsquares
		});
	});
});

function filterLocation(docs, id, size, start){
	WorldMap.find({"simpleID" : id}, 'user squares', function(err, map){
		var splitstart = start.split('x');
		var startX = splitstart[0];
		var startY = splitstart[1];
		var allX = [];
		allX.push(splitstart[0]);
		var allY = [];
		allY.push(splitstart[1]);
		var allLocations = [];
		for(var i=1; i<=size; i++){
			if(startX+i<100){
				allX.push(startX+i);
			}
			else{ allX.push("water");}

			if(startXi>0){
				allX.unshift(startX-i);
			}
			else{ allX.unshift("water");}

			if(startY+i<100){
				allY.push(startY+i);
			}
			else{ allY.push("water");}

			if(startY-i>0){
				allY.unshift(startY-i);
			}
			else{ allY.unshift("water");}
		}
		for(var j=0; j<allX.length; j++){
			for(var k=0; k<allY.length; k++){
				if(allX[j]!="water" && allY[k]!="water"){
				var loc = allX[j]+"x"+allY[k];
				allLocations.push(loc);
				}
				else{
					allLocations.push("water");
				}
			}
		}
		var allsquares = [];
		var row = [];
		var counter = 1;
		for(var s in allLocations){
			if(s!="water"){
				row.push([s, squares.s]);
			}
			else{
				row.push([s, s]);
			}
			counter++;
			if(counter%size===0){
				allsquares.push(row);
				row = [];
			}
		}
		return allsquares;
			
		

	});
}

module.exports = router;
