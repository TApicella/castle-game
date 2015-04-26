# [SublimeLinter ignore:E228]


squarestring = ""
for i in range(1, 100):
	for j in range(1, 100):
		squarestring = squarestring+"\""+str(i)+"x"+str(j)+"\" : \"f\","
		if j%20 == 0:
			squarestring = squarestring+"\n"

squarestring = squarestring[0:-1]
with open("squares.txt", 'w') as f:
	f.write(squarestring)
