Originally, this was to become a game of the idle gaming genre where you make a small castle and it grows over time. 

Although I have given up on that project, there is still a lot of interesting code here.

The core idea is that when someone goes to /new, a new map is generated procedurally and saved in a database. 
Then, the URL determines the location on the map and the zoom level of the user: '/:id/:size/:start/', displaying squares of the map dynamically

Tiles were displayed using Handlebars templates in a grid

Note- build is currently broken
