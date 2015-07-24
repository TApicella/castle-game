#https://github.com/icbmike/terrainGenerator/blob/master/README.md
import random
from PIL import Image


class TerrainGenerator(object):
	def __init__(self, width, height, growth_threshold, decay, num_seeds, filename, source=None, movein=True, fill_color=(23, 115, 26), border_color=(23, 115, 27), block_colors=[(23, 115, 26)]):
		self.width = width
		self.height = height
		self.growth_threshold = growth_threshold
		self.decay = decay
		self.num_seeds = num_seeds
		self.filename = filename
		self.source = source
		self.movein = movein
		self.fill_color = fill_color
		self.border_color = border_color
		self.block_colors = block_colors
		self.recursion_counter = 0

	def get_recursion_depth(self):
		return self.recursion_counter

	def generate_terrain(self):

		if self.source is None:
			#Construct the map
			image = Image.new("RGB", (self.width, self.height), (0, 128, 255))
			self.source = self.filename
		else:
			image = Image.open(self.source)
		#Get access to the pixel data
		self.map = image.load()

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
		#Turn the map into a png
		image.save(self.filename)

		#Load generated map and make sure there's enough land
		while self._not_enough_land(0.4):
			self.num_seeds = 20
			self.generate_terrain()

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

		if self.map[seed_x, seed_y] in block_colors:
			return
		elif random.random() > growth_threshold:
			self.map[seed_x, seed_y] = border_color
			return
		else:
			self.map[seed_x, seed_y] = fill_color
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
				if self.map[x, y] == (0, 128, 255):
					counter = counter+1.0
		percent_water = counter/total
		print percent_water
		if percent_water > percentage:
			return True
