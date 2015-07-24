from PIL import Image

source = Image.open("map4.png")
img = source.load()

map_data = {}

curr_x = 1
curr_y = 1
#Go over each chunk and get the pixel info
for x in range(0, 100, 10):
	curr_x = x+1
	for y in range(0, 100, 10):
		curr_y = y+1
		chunk = str(curr_x)+"X"+str(curr_y)
		if chunk not in map_data:
			map_data[chunk] = {}
		for j in range(0, 10):
			for k in range(0, 10):
				loc = str(curr_x+j)+"x"+str(curr_y+k)
				map_data[chunk][loc] = img[x+j, y+k]
#print map_data.keys()
#print map_data["1X1"]
print len(map_data.keys())
print len(map_data["1X1"].keys())
