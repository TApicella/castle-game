from PIL import Image
import random
import terrainGenerator as tg

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
generator = tg.TerrainGenerator(100, 100, 0.9, 0.05, num_seeds, "map2.png", "map.png", False, fill_color=FOREST, border_color=FOREST2, block_colors=[(WATER, SHORE, FOREST, GRASSLAND2)])
generator.generate_terrain()

#Add deserts
num_seeds = random.randint(3, 4)
generator2 = tg.TerrainGenerator(100, 100, 0.9, 0.1, num_seeds, "map3.png", "map2.png", False, fill_color=DESERT, border_color=DESERT2, block_colors=[(WATER, SHORE, FOREST, FOREST2, GRASSLAND2, DESERT)])
generator2.generate_terrain()

#Final touches
source = Image.open("map3.png")
img = source.load()

#Smooth colors part 1: basics
print "smoothing colors"
for x in range(0, 100):
	for y in range(0, 100):
		if img[x, y] == GRASSLAND2:
			img[x, y] = GRASSLAND
		elif img[x, y] == FOREST2:
			img[x, y] = FOREST
		elif img[x, y] == DESERT2:
			img[x, y] = DESERT


#Add savanna
print "adding savanna"
for x in range(1, 100):
	for y in range(1, 100):
		if img[x, y] == DESERT:
			if img[x, y-1] == GRASSLAND:
				img[x, y] = SAVANNA
			elif img[x, y+1] in NONDESERT:
				img[x, y] = SAVANNA
			elif img[x-1, y] in NONDESERT:
				img[x, y] = SAVANNA
			elif img[x+1, y] in NONDESERT:
				img[x, y] = SAVANNA

#Make the savanna two layers
print "expanding savanna"
for x in range(1, 100):
	for y in range(1, 100):
		if img[x, y] == DESERT:
			if img[x, y-1] == SAVANNA:
				img[x, y] = SAVANNA2
			elif img[x, y+1] == SAVANNA:
				img[x, y] = SAVANNA2
			elif img[x-1, y] == SAVANNA:
				img[x, y] = SAVANNA2
			elif img[x+1, y] == SAVANNA:
				img[x, y] = SAVANNA2

#Smooth colors part 2: savanna
print "smoothing savanna"
for x in range(0, 100):
	for y in range(0, 100):
		if img[x, y] == SAVANNA2:
			img[x, y] = SAVANNA

#Add beach
print "adding beach"
for x in range(0, 100):
	for y in range(0, 100):
		if img[x, y] == WATER:
			if y != 0:
				if img[x, y-1] in NONSHORE:
					img[x, y-1] = SHORE
			if y != 99:
				if img[x, y+1] in NONSHORE:
					img[x, y+1] = SHORE
			if x != 0:
				if img[x-1, y] in NONSHORE:
					img[x-1, y] = SHORE
			if x != 99:
				if img[x+1, y] in NONSHORE:
					img[x+1, y] = SHORE
		else:
			if x == 0 or x == 99 or y == 0 or y == 99:
				if img[x, y] != WATER:
					img[x, y] = SHORE

source.save("map4.png")
