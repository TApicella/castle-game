//https){//github.com/icbmike/terrainGenerator/blob/master/README.md
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
				if(mymap[i][j-1] == GRASSLAND){
					mymap[i][j] = SAVANNA;
				}
				else if(mymap[i][j+1] in NONDESERT){
					mymap[i][j] = SAVANNA;
				}
				else if(mymap[i-1][j] in NONDESERT){
					mymap[i][j] = SAVANNA;
				}
				else if(mymap[i+1][j] in NONDESERT){
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
					if(mymap[q][r-1] in NONSHORE){
						mymap[q][r-1] = SHORE;
					}
				}
				if(r != 99){
					if(mymap[q][r+1] in NONSHORE){
						mymap[q][r+1] = SHORE;
					}
				}
				if(q !== 0){
					if(mymap[q-1][r] in NONSHORE){
						mymap[q-1][r] = SHORE;
					}
				}
				if(q != 99){
					if(mymap[q+1][r] in NONSHORE){
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
	//100, 100, growth threshold, decay rate, number of seeds
	console.log("Generating map");
	var	newmap = terrain_gen(0.9, 0.01, 25, false, true, "g", "g2", ["g"]);
	//console.log(newmap[0]);
	console.log("Transforming map");
	var	finalmap = transform_map(newmap);
	//console.log(finalmap[50]);
	return finalmap;
}

//$(document).ready(function(){
//	main();
//});
