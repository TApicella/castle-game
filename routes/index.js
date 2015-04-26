var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var WorldMap = require('../models/Map.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//Examples:
/*
GET Hello World page. 
router.get('/helloworld', function(req, res){
	res.render('helloworld', { title: 'Hello, World!'});
});

GET Userlist page. 
router.get('/userlist', function(req, res, next) {
	User.find(function(err,docs){
		if (err) return next(err);
		res.render('userlist', {
			"userlist" : docs
		});
	});
}); */

module.exports = router;
