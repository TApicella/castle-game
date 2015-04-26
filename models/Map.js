var mongoose = require('mongoose');

var MapSchema = new mongoose.Schema({
	simpleID: Number,
	user: String,
	squares: Array
}, { minimize: false });

module.exports = mongoose.model('map', MapSchema);