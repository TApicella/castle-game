#https://github.com/icbmike/terrainGenerator/blob/master/README.md
import random
from PIL import Image


def terrain_gen(growth_threshold, decay, num_seeds, mymap=None, movein=True, fill_color="g", border_color="g2", block_colors=[("g")]):
	if mymap is None:
		#Construct the map
		mymap = [["w"]*100 for i in range(100)]

	for x in range(0, num_seeds + 1):
		#Determine the seed
		seed = int(random.random() * 100 * 100)

		seed_x = seed%100
		seed_y = seed/100
		#Move the seed closer to the center of the map
		if seed_x < 10:
			seed_x = seed_x+10
		if seed_x > 100-10:
			seed_x = seed_x-10
		if seed_y < 10:
			seed_y = seed_y+10
		if seed_y > 100-10:
			seed_y = seed_y-10
		if movein:
			#Move the corners less
			if seed_x+(100/10) < (100/4) and seed_y+(100/10) < (100/4):
				final_seed_x = seed_x+(100/12)
				final_seed_y = seed_y+(100/12)
			elif seed_x-(100/10) > (100/4) and seed_y-(100/10) > (100/4):
				final_seed_x = seed_x-(100/12)
				final_seed_y = seed_y-(100/12)
			else:
				if seed_x+(100/10) < (100/4):
					final_seed_x = seed_x+(100/10)
				elif seed_x-(100/10) > (100/4):
					final_seed_x = seed_x-(100/10)
				else:
					final_seed_x = seed_x

				if seed_y+(100/10) < (100/4):
					final_seed_y = seed_y+(100/10)
				elif seed_y-(100/10) > (100/4):
					final_seed_y = seed_y-(100/10)
				else:
					final_seed_y = seed_y
		else:
			final_seed_x = seed_x
			final_seed_y = seed_y
		mymap = grow_seed(mymap, final_seed_x, final_seed_y, growth_threshold, decay, fill_color, border_color, block_colors)

	#Load generated map and make sure there's enough land
	while not_enough_land(mymap, 0.4):
		num_seeds = 20
		mymap = terrain_gen(growth_threshold, decay, num_seeds, mymap, movein=True, fill_color="g", border_color="g2", block_colors=["g"])

	return mymap


def grow_seed(mymap, seed_x, seed_y, growth_threshold, decay, fill_color, border_color, block_colors):
	edge = 100-5
	#Avoid edge seeds
	if seed_x <= 5:
		growth_threshold = growth_threshold-(0.01+(0.01*(5-seed_x)))
	if seed_x >= edge:
		growth_threshold = growth_threshold-(0.01+(0.01*(seed_x-edge)))
	if seed_y <= 5:
		growth_threshold = growth_threshold-(0.01+(0.01*(5-seed_y)))
	if seed_y >= edge:
		growth_threshold = growth_threshold-(0.01+(0.01*(seed_y-edge)))

	if mymap[seed_x][seed_y] in block_colors:
		return mymap
	elif random.random() > growth_threshold:
		mymap[seed_x][seed_y] = border_color
		return mymap
	else:
		mymap[seed_x][seed_y] = fill_color
		if seed_x != 0:
			mymap = grow_seed(mymap, seed_x - 1, seed_y, growth_threshold - decay, decay, fill_color, border_color, block_colors)

		if seed_x != 100 - 1:
			mymap = grow_seed(mymap, seed_x + 1, seed_y, growth_threshold - decay, decay,  fill_color, border_color, block_colors)

		if seed_y != 0:
			mymap = grow_seed(mymap, seed_x, seed_y - 1, growth_threshold - decay, decay,  fill_color, border_color, block_colors)

		if seed_y != 100 - 1:
			mymap = grow_seed(mymap, seed_x, seed_y + 1, growth_threshold - decay, decay,  fill_color, border_color, block_colors)
	return mymap


def not_enough_land(mymap, percentage):
	counter = 0.0
	total = float(100*100)
	for x in range(0, 100):
		for y in range(0, 100):
			if mymap[x][y] == "s":
				counter = counter+1.0
	percent_water = counter/total
	print percent_water
	if percent_water > percentage:
		return True


def transform_map(mymap=None):
	SHORE = "s"
	WATER = "w"
	GRASSLAND = "g"
	GRASSLAND2 = "g2"
	FOREST = "f"
	FOREST2 = "f2"
	DESERT = "d"
	DESERT2 = "d2"
	SAVANNA = "v"
	SAVANNA2 = "v2"
	NONSHORE = [GRASSLAND, FOREST, DESERT, SAVANNA]
	NONDESERT = [GRASSLAND, FOREST]

	#Add forests
	num_seeds = random.randint(3, 5)
	mymap = terrain_gen(0.9, 0.05, num_seeds, mymap, False, fill_color=FOREST, border_color=FOREST2, block_colors=[(WATER, SHORE, FOREST, GRASSLAND2)])

	#Add deserts
	num_seeds = random.randint(2, 3)
	mymap = terrain_gen(0.9, 0.1, num_seeds, mymap, False, fill_color=DESERT, border_color=DESERT2, block_colors=[(WATER, SHORE, FOREST, FOREST2, GRASSLAND2, DESERT)])

	#Smooth colors part 1: basics
	print "smoothing colors"
	for x in range(0, 100):
		for y in range(0, 100):
			if mymap[x][y] == GRASSLAND2:
				mymap[x][y] = GRASSLAND
			elif mymap[x][y] == FOREST2:
				mymap[x][y] = FOREST
			elif mymap[x][y] == DESERT2:
				mymap[x][y] = DESERT

	#Add savanna
	print "adding savanna"
	for x in range(1, 100):
		for y in range(1, 100):
			if mymap[x][y] == DESERT:
				if mymap[x][y-1] == GRASSLAND:
					mymap[x][y] = SAVANNA
				elif mymap[x][y+1] in NONDESERT:
					mymap[x][y] = SAVANNA
				elif mymap[x-1][y] in NONDESERT:
					mymap[x][y] = SAVANNA
				elif mymap[x+1][y] in NONDESERT:
					mymap[x][y] = SAVANNA

	#Make the savanna two layers
	print "expanding savanna"
	for x in range(1, 100):
		for y in range(1, 100):
			if mymap[x][y] == DESERT:
				if mymap[x][y-1] == SAVANNA:
					mymap[x][y] = SAVANNA2
				elif mymap[x][y+1] == SAVANNA:
					mymap[x][y] = SAVANNA2
				elif mymap[x-1][y] == SAVANNA:
					mymap[x][y] = SAVANNA2
				elif mymap[x+1][y] == SAVANNA:
					mymap[x][y] = SAVANNA2

	#Smooth colors part 2: savanna
	print "smoothing savanna"
	for x in range(0, 100):
		for y in range(0, 100):
			if mymap[x][y] == SAVANNA2:
				mymap[x][y] = SAVANNA

	#Add beach
	print "adding beach"
	for x in range(0, 100):
		for y in range(0, 100):
			if mymap[x][y] == WATER:
				if y != 0:
					if mymap[x][y-1] in NONSHORE:
						mymap[x][y-1] = SHORE
				if y != 99:
					if mymap[x][y+1] in NONSHORE:
						mymap[x][y+1] = SHORE
				if x != 0:
					if mymap[x-1][y] in NONSHORE:
						mymap[x-1][y] = SHORE
				if x != 99:
					if mymap[x+1][y] in NONSHORE:
						mymap[x+1][y] = SHORE
			else:
				if x == 0 or x == 99 or y == 0 or y == 99:
					if mymap[x][y] != WATER:
						mymap[x][y] = SHORE

	test_map(mymap)


def test_map(mymap):
	SHORE = (250, 239, 210)
	WATER = (0, 128, 255)
	GRASSLAND = (23, 115, 26)
	FOREST = (27, 94, 5)
	DESERT = (240, 240, 254)
	SAVANNA = (219, 205, 173)
	image = Image.new("RGB", (100, 100), WATER)
	img_map = image.load()
	for x in range(0, len(mymap)):
		for y in range(0, len(mymap[0])):
			if mymap[x][y] == "w":
				color = WATER
			if mymap[x][y] == "s":
				color = SHORE
			if mymap[x][y] == "g":
				color = GRASSLAND
			if mymap[x][y] == "f":
				color = FOREST
			if mymap[x][y] == "d":
				color = DESERT
			if mymap[x][y] == "v":
				color = SAVANNA
			img_map[x, y] = color
	image.save("mathmap.png")


def main():
	#100, 100, growth threshold, decay rate, number of seeds
	newmap = terrain_gen(0.9, 0.01, 25, None, True, fill_color="g", border_color="g2", block_colors=["g"])
	transform_map(newmap)

main()
