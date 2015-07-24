var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var WorldMap = require('../models/ChunkMap.js');
//var terrainGenerator = require('../utilities/terrain_generator/terrain_generator.js');

/* GET map data. */
router.get('/', function(req, res, next) {
	WorldMap.find(function(err,docs){
		if (err) return next(err);
		res.render('allchunkmaps', {
			"allchunkmaps" : docs
		});
	});
});

router.get("/new", function(req, res, next){
	var allsquares = main();
	var newID;

	var createMap = function(err, count){
        newID = count;
        var stringID = newID.toString();
		var newmap = new WorldMap({
			simpleID: stringID,
			user: "testuser3",
			chunks: {}
		});
		for(var x=0; x<100; x++){
			for(var y=0; y<100; y++){
				var loc = ((x+1).toString())+"x"+((y+1).toString());
				var chunk = (Math.floor((x/10)+1).toString())+"X"+(Math.floor((y/10)+1).toString());
				if(!newmap.chunks[chunk]){
					newmap.chunks[chunk] = {};
				}
				newmap.chunks[chunk][loc] = allsquares[x][y];
			}
		}
		newmap.save(function(err, newmap){
			if (err) return console.error(err);
		});
		var newurl = "/maps/"+stringID+"/10/1x1/";
		res.redirect(newurl);
	};

	WorldMap.count({}, createMap);
});

/* GET localized data. */
router.get('/:id', function(req, res, next) {
	var size = 5;
	var start = "1x1";
	var id = req.params.id;
	var newurl = "/maps/"+id+"/"+size+"/"+start+"/";
	res.redirect(newurl);
});

/* GET localized data. */
router.get('/:id/:size/', function(req, res, next) {
	var size = req.params.size;
	var start = "1x1";
	var id = req.params.id;
	var newurl = "/maps/"+id+"/"+size+"/"+start+"/";
	res.redirect(newurl);
});

/* GET localized data. */
router.get('/:id/:size/:start/', function(req, res, next) {
	var size = req.params.size;
	var start = req.params.start;
	var id = req.params.id;
	var splitstart = start.split("x");
	var startx = splitstart[0];
	var starty = splitstart[1];

	//Determine needed chunks
	var chunkstartx = Math.floor((parseInt(startx, 10)-parseInt(size, 10))/10);
	var chunkstarty = Math.floor((parseInt(starty, 10)-parseInt(size, 10))/10);
	var chunkendx = Math.floor((parseInt(startx, 10)+parseInt(size, 10))/10)+1;
	var chunkendy = Math.floor((parseInt(starty, 10)+parseInt(size, 10))/10)+1;
	if(chunkstartx<1) chunkstartx = 1;
	if(chunkstarty<1) chunkstarty = 1;
	if(chunkendx>100) chunkendx = 100;
	if(chunkendy>100) chunkendy = 100;
	var needed_chunks = "";
	for(var i=chunkstartx; i<=chunkendx; i++){
		for(var j=chunkstarty; j<=chunkendy; j++){
			chunkname = (i.toString())+"X"+(j.toString());
			needed_chunks = needed_chunks+"chunks."+chunkname;
			if(i!=chunkendx || j!=chunkendy) needed_chunks = needed_chunks+" ";
		}
	}

	WorldMap.find({"simpleID" : req.params.id}, needed_chunks, function(err,docs){
		if (err) return next(err);
		var dimensions = (2*size)+1;
		var sqsize = 100/dimensions;
		var sqsizestring = sqsize+"%";
		var allsquares = filterLocation(docs, size, start);
		
		if(startx<1 || starty<1 || startx>=100 || starty>=100 || size<1){
			if(startx<1) startx=1;
			if(starty<1) starty=1;
			if(startx>=100) startx=99;
			if(starty>=100) starty=99;
			var newstart = startx+"x"+starty;
			if(size<1) size=1;
			var newurl = "/maps/"+id+"/"+size+"/"+newstart+"/";
			res.redirect(newurl);
		}
		else {res.render('map2', {
			"allsquares" : allsquares, "sqsize" : sqsizestring, "dimensions":dimensions,
			"id":id, "size":size, "left":parseInt(startx, 10)-1, "right":parseInt(startx, 10)+1, "up":parseInt(starty, 10)-1, "down":parseInt(starty, 10)+1, "zoomin":parseInt(size, 10)-1, "zoomout":parseInt(size, 10)+1
			});
		}
	});
});

function filterLocation(docs, size, start){
	var squares = {};
	var chunks = docs[0].chunks;
	for(var c in chunks){
		for(var sloc in chunks[c]){
			squares[sloc] = chunks[c][sloc];
		}
	}
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
		}
		else{ allX.push("w");}

		if(startX-i<100 && startX-i>=1){
			allX.unshift(startX-i);
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
	var allsquares = [];
	var row = [];
	var counter = 1;
	for(var s in allLocations){
		var sq = allLocations[s];
		if(sq!="w"){
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


function terrain_gen(growth_threshold, decay, num_seeds, map, movein, fill_color, border_color, block_colors){
	var mymap = [];
	if(map === false){
		//Construct the map
		for(var i=0; i<100; i++){
			mymap[i] = [];
			for(var j=0; j<100; j++){
				mymap[i][j]="w";
			}
		}
	}
	else{
		mymap = map;
	}
	
	var seed;
	var seed_x;
	var seed_y;
	var final_seed_x;
	var final_seed_y;

	for(var x=0; x<=num_seeds; x++){
		//Determine the seed
		seed = Math.floor(Math.random() * 100 * 100, 10);

		seed_x = seed%100;
		seed_y = Math.floor(seed/100);
		//Move the seed closer to the center of the map
		if(seed_x < 10){
			seed_x = seed_x+10;
		}
		if(seed_x > 100-10){
			seed_x = seed_x-10;
		}
		if(seed_y < 10){
			seed_y = seed_y+10;
		}
		if(seed_y > 100-10){
			seed_y = seed_y-10;
		}
		if(movein){
			//Move the corners less
			if(seed_x+(10) < (25) && seed_y+(10) < (25)){
				final_seed_x = seed_x+(8);
				final_seed_y = seed_y+(8);
			}
			else if(seed_x-(10) > (25) && seed_y-(10) > (25)){
				final_seed_x = seed_x-(8);
				final_seed_y = seed_y-(8);
			}
			else{
				if(seed_x+(10) < (25)){
					final_seed_x = seed_x+(10);
				}
				else if(seed_x-(10) > (25)){
					final_seed_x = seed_x-(10);
				}
				else{
					final_seed_x = seed_x;
				}

				if(seed_y+(10) < (25)){
					final_seed_y = seed_y+(10);
				}
				else if(seed_y-(10) > (25)){
					final_seed_y = seed_y-(10);
				}
				else{
					final_seed_y = seed_y;
				}
			}
		}
		else{
			final_seed_x = seed_x;
			final_seed_y = seed_y;
		}
		mymap = grow_seed(mymap, final_seed_x, final_seed_y, growth_threshold, decay, fill_color, border_color, block_colors);
	}
	//Load generated map and make sure there's enough land
	while(not_enough_land(mymap, 0.4)){
		num_seeds = 20;
		mymap = terrain_gen(growth_threshold, decay, num_seeds, mymap, movein=True, fill_color="g", border_color="g2", block_colors=["g"]);
	}
	return mymap;
	
}

function grow_seed(mymap, seed_x, seed_y, growth_threshold, decay, fill_color, border_color, block_colors){
	var edge = 100-5;
	//Avoid edge seeds
	if(seed_x <= 5){
		growth_threshold = growth_threshold-(0.01+(0.01*(5-seed_x)));
	}
	if(seed_x >= edge){
		growth_threshold = growth_threshold-(0.01+(0.01*(seed_x-edge)));
	}
	if(seed_y <= 5){
		growth_threshold = growth_threshold-(0.01+(0.01*(5-seed_y)));
	}
	if(seed_y >= edge){
		growth_threshold = growth_threshold-(0.01+(0.01*(seed_y-edge)));
	}

	if(block_colors.indexOf(mymap[seed_x][seed_y]) != -1){
		return mymap;
	}
	else if(Math.random() > growth_threshold){
		mymap[seed_x][seed_y] = border_color;
		return mymap;
	}
	else{
		mymap[seed_x][seed_y] = fill_color;
		if(seed_x !== 0){
			mymap = grow_seed(mymap, seed_x - 1, seed_y, growth_threshold - decay, decay, fill_color, border_color, block_colors);
		}

		if(seed_x != (100 - 1)){
			mymap = grow_seed(mymap, seed_x + 1, seed_y, growth_threshold - decay, decay,  fill_color, border_color, block_colors);
		}

		if(seed_y !== 0){
			mymap = grow_seed(mymap, seed_x, seed_y - 1, growth_threshold - decay, decay,  fill_color, border_color, block_colors);
		}

		if(seed_y != (100 - 1)){
			mymap = grow_seed(mymap, seed_x, seed_y + 1, growth_threshold - decay, decay,  fill_color, border_color, block_colors);
		}
	}
	return mymap;
}

function not_enough_land(mymap, percentage){
	var counter = 0.0;
	var total = 100.0*100.0;
	for(var x=0; x<100; x++){
		for(var y=0; y<100; y++){
			if(mymap[x][y] == "s"){
				counter = counter+1.0;
			}
		}
	}
	var percent_water = counter/total;
	if(percent_water > percentage){
		return true;
	}
}

function transform_map(mymap){
	SHORE = "s";
	WATER = "w";
	GRASSLAND = "g";
	GRASSLAND2 = "g2";
	FOREST = "f";
	FOREST2 = "f2";
	DESERT = "d";
	DESERT2 = "d2";
	SAVANNA = "v";
	SAVANNA2 = "v2";
	NONSHORE = [GRASSLAND, FOREST, DESERT, SAVANNA];
	NONDESERT = [GRASSLAND, FOREST];

	//Add forests
	var num_seeds = Math.floor((Math.random() * 3) + 3);

	mymap = terrain_gen(0.9, 0.05, num_seeds, mymap, false, FOREST, FOREST2, [(WATER, SHORE, FOREST, GRASSLAND2)]);

	//Add deserts
	num_seeds = Math.floor((Math.random() * 2) + 2);

	mymap = terrain_gen(0.9, 0.1, num_seeds, mymap, false, DESERT, DESERT2, [(WATER, SHORE, FOREST, FOREST2, GRASSLAND2, DESERT)]);

	//Smooth colors part 1){ basics
	for(var x=0; x<100; x++){
		for(var y=0; y<100; y++){
			if(mymap[x][y] == GRASSLAND2){
				mymap[x][y] = GRASSLAND;
			}
			else if(mymap[x][y] == FOREST2){
				mymap[x][y] = FOREST;
			}
			else if(mymap[x][y] == DESERT2){
				mymap[x][y] = DESERT;
			}
		}
	}

	//Add savanna
	for(var i=1; i<100; i++){
		for(var j=1; j<100; j++){
			if(mymap[i][j] == DESERT){
				if(NONDESERT.indexOf(mymap[i][j-1]) != -1){
					mymap[i][j] = SAVANNA;
				}
				else if(NONDESERT.indexOf(mymap[i][j+1]) != -1){
					mymap[i][j] = SAVANNA;
				}
				else if(NONDESERT.indexOf(mymap[i-1][j]) != -1){
					mymap[i][j] = SAVANNA;
				}
				else if(NONDESERT.indexOf(mymap[i+1][j]) != -1){
					mymap[i][j] = SAVANNA;
				}
			}
		}
	}

	//Make the savanna two layers
	for(var k=1; k<100; k++){
		for(var l=1; l<100; l++){
			if(mymap[k][l] == DESERT){
				if(mymap[k][l-1] == SAVANNA){
					mymap[k][l] = SAVANNA2;
				}
				else if(mymap[k][l+1] == SAVANNA){
					mymap[k][l] = SAVANNA2;
				}
				else if(mymap[k-1][l] == SAVANNA){
					mymap[k][l] = SAVANNA2;
				}
				else if(mymap[k+1][l] == SAVANNA){
					mymap[k][l] = SAVANNA2;
				}
			}
		}
	}

	//Smooth colors part 2){ savanna
	for(var m=0; m<100; m++){
		for(var n=0; n<100; n++){
			if(mymap[m][n] == SAVANNA2){
				mymap[m][n] = SAVANNA;
			}
		}
	}

	//Add beach
	for(var q=0; q<100; q++){
		for(var r=0; r<100; r++){
			if(mymap[q][r] == WATER){
				if(r !== 0){
					if(NONSHORE.indexOf(mymap[q][r-1]) != -1){
						mymap[q][r-1] = SHORE;
					}
				}
				if(r != 99){
					if(NONSHORE.indexOf(mymap[q][r+1]) != -1){
						mymap[q][r+1] = SHORE;
					}
				}
				if(q !== 0){
					if(NONSHORE.indexOf(mymap[q-1][r]) != -1){
						mymap[q-1][r] = SHORE;
					}
				}
				if(q != 99){
					if(NONSHORE.indexOf(mymap[q+1][r]) != -1){
						mymap[q+1][r] = SHORE;
					}
				}
			}
			else{
				if(q === 0 || q == 99 || r === 0 || r == 99){
					if(mymap[q][r] != WATER){
						mymap[q][r] = SHORE;
					}
				}
			}
		}
	}
	return mymap;
}

function main(){
	console.log("Generating map");
	var	newmap = terrain_gen(0.9, 0.01, 25, false, true, "g", "g2", ["g"]);
	console.log("Transforming map");
	var	finalmap = transform_map(newmap);
	return finalmap;
}



module.exports = router;
