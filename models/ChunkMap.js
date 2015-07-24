var mongoose = require('mongoose');

var ChunkMapSchema = new mongoose.Schema({
	simpleID: Number,
	user: String,
	chunks: {}
}, { minimize: false });

module.exports = mongoose.model('chunkmap', ChunkMapSchema);