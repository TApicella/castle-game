#https://github.com/icbmike/terrainGenerator/blob/master/README.md
import random
from PIL import Image
import argparse


class TerrainGenerator(object):
	def __init__(self, width, height, growth_threshold, decay, num_seeds, filename, map=None, movein=True, fill_color=(23, 115, 26), border_color=(23, 115, 27), block_colors=[(23, 115, 26)]):
		self.width = width
		self.height = height
		self.growth_threshold = growth_threshold
		self.decay = decay
		self.num_seeds = num_seeds
		self.filename = filename
		self.map = map
		self.movein = movein
		self.fill_color = fill_color
		self.border_color = border_color
		self.block_colors = block_colors
		self.recursion_counter = 0

	def get_recursion_depth(self):
		return self.recursion_counter

	def generate_terrain(self):

		if self.map is None:
			#Construct the map
			self.map = [[(0, 128, 255)]*100 for i in range(100)]

		for x in xrange(self.num_seeds + 1):
			#Determine the seed
			seed = int(random.random() * self.width * self.height)

			seed_x = seed%self.width
			seed_y = seed/self.width
			#Move the seed closer to the center of the map
			if seed_x < 10:
				seed_x = seed_x+10
			if seed_x > self.width-10:
				seed_x = seed_x-10
			if seed_y < 10:
				seed_y = seed_y+10
			if seed_y > self.height-10:
				seed_y = seed_y-10
			if self.movein:
				#Move the corners less
				if seed_x+(self.width/10) < (self.width/4) and seed_y+(self.height/10) < (self.height/4):
					final_seed_x = seed_x+(self.width/12)
					final_seed_y = seed_y+(self.height/12)
				elif seed_x-(self.width/10) > (self.width/4) and seed_y-(self.height/10) > (self.height/4):
					final_seed_x = seed_x-(self.width/12)
					final_seed_y = seed_y-(self.height/12)
				else:
					if seed_x+(self.width/10) < (self.width/4):
						final_seed_x = seed_x+(self.width/10)
					elif seed_x-(self.width/10) > (self.width/4):
						final_seed_x = seed_x-(self.width/10)
					else:
						final_seed_x = seed_x

					if seed_y+(self.height/10) < (self.height/4):
						final_seed_y = seed_y+(self.height/10)
					elif seed_y-(self.height/10) > (self.height/4):
						final_seed_y = seed_y-(self.height/10)
					else:
						final_seed_y = seed_y
			else:
				final_seed_x = seed_x
				final_seed_y = seed_y
			self._grow_seed(final_seed_x, final_seed_y, self.growth_threshold, self.fill_color, self.border_color, self.block_colors)

		#Load generated map and make sure there's enough land
		while self._not_enough_land(0.4):
			self.num_seeds = 20
			self.generate_terrain()

		print self.map
		return self.map

	def _grow_seed(self, seed_x, seed_y, growth_threshold, fill_color, border_color, block_colors):
		self.recursion_counter += 1

		width_edge = self.width-5
		height_edge = self.height-5
		#Avoid edge seeds
		if seed_x <= 5:
			growth_threshold = growth_threshold-(0.01+(0.01*(5-seed_x)))
		if seed_x >= width_edge:
			growth_threshold = growth_threshold-(0.01+(0.01*(seed_x-width_edge)))
		if seed_y <= 5:
			growth_threshold = growth_threshold-(0.01+(0.01*(5-seed_y)))
		if seed_y >= height_edge:
			growth_threshold = growth_threshold-(0.01+(0.01*(seed_y-height_edge)))

		if self.map[seed_x][seed_y] in block_colors:
			return
		elif random.random() > growth_threshold:
			self.map[seed_x][seed_y] = border_color
			return
		else:
			self.map[seed_x][seed_y] = fill_color
			if seed_x != 0:
				self._grow_seed(seed_x - 1, seed_y, growth_threshold - self.decay, fill_color, border_color, block_colors)

			if seed_x != self.width - 1:
				self._grow_seed(seed_x + 1, seed_y, growth_threshold - self.decay, fill_color, border_color, block_colors)

			if seed_y != 0:
				self._grow_seed(seed_x, seed_y - 1, growth_threshold - self.decay, fill_color, border_color, block_colors)

			if seed_y != self.height - 1:
				self._grow_seed(seed_x, seed_y + 1, growth_threshold - self.decay, fill_color, border_color, block_colors)

	def _not_enough_land(self, percentage):
		counter = 0.0
		total = float(self.width*self.height)
		for x in range(0, self.width):
			for y in range(0, self.height):
				if self.map[x][y] == (0, 128, 255):
					counter = counter+1.0
		percent_water = counter/total
		print percent_water
		if percent_water > percentage:
			return True


def transform_map(mymap=None):
	SHORE = (250, 239, 210)
	WATER = (0, 128, 255)
	GRASSLAND = (23, 115, 26)
	GRASSLAND2 = (23, 115, 27)
	FOREST = (27, 94, 5)
	FOREST2 = (27, 94, 6)
	DESERT = (240, 240, 254)
	DESERT2 = (240, 240, 255)
	SAVANNA = (219, 205, 173)
	SAVANNA2 = (219, 205, 174)
	NONSHORE = [GRASSLAND, FOREST, DESERT, SAVANNA]
	NONDESERT = [GRASSLAND, FOREST]

	#Add forests
	num_seeds = random.randint(3, 5)
	generator = TerrainGenerator(100, 100, 0.9, 0.05, num_seeds, "map2.png", mymap, False, fill_color=FOREST, border_color=FOREST2, block_colors=[(WATER, SHORE, FOREST, GRASSLAND2)])
	mymap = generator.generate_terrain()

	#Add deserts
	num_seeds = random.randint(2, 3)
	generator2 = TerrainGenerator(100, 100, 0.9, 0.1, num_seeds, "map3.png", mymap, False, fill_color=DESERT, border_color=DESERT2, block_colors=[(WATER, SHORE, FOREST, FOREST2, GRASSLAND2, DESERT)])
	mymap = generator2.generate_terrain()

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
	image = Image.new("RGB", (100, 100), (0, 128, 255))
	img_map = image.load()
	for x in range(0, len(mymap)):
		for y in range(0, len(mymap[0])):
			img_map[x, y] = mymap[x][y]
	image.save("mathmap.png")


def main():
	parser = argparse.ArgumentParser(description="""A small program to generate
					simple terrains using seed growing""")
	parser.add_argument("-width", "-w", default=100, type=int, dest="width", help="The width of the generated image - default is 300")
	parser.add_argument("-height", "-he", default=100, type=int, dest="height",	help="The height of the generated image - default is 300")
	parser.add_argument("-growth-threshold", "-g", default=0.9, type=float,	dest="growth_threshold", help="""The growth threshold above which a	seed stops growing - default is 0.9""")
	parser.add_argument("-decay-rate", "-d", default=0.01, type=float, dest="decay", help="""The rate at which the growth threshold	decreases - default is 0.01""")
	parser.add_argument("-number-of-seeds", "-n", default=25, type=int,	dest="num_seeds", help="""The number of seeds to grow land from - default is 25""")
	parser.add_argument("-filename", "-f", default="map.png", dest="filename", help="The output filename - default is map.png")
	parser.add_argument("-verbose", "-v", action='store_true', dest='verbose', help="Should the recursion depth be shown? - default is true")

	args = parser.parse_args()

	#width, height, growth threshold, decay rate, number of seeds
	tg = TerrainGenerator(args.width, args.height, args.growth_threshold, args.decay, args.num_seeds, args.filename)

	newmap = tg.generate_terrain()
	transform_map(newmap)

main()
