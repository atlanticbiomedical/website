var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restify = require('express-restify-mongoose');

mongoose.connect('mongodb://localhost/biomed');

var Post = new Schema({
	title: { type: String },
	preview: { type: String },
	details: { type: String },
	image: { type: String },
	gallery: [
		{ type: String }
	],
	status: { type: String }
});
var PostModel = mongoose.model('Post', Post);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
restify.serve(app, PostModel, {
	prereq: function(req) {
		return req.method === 'GET';
	}
});

http.createServer(app).listen(3000, function() {
	console.log('Express server listening on port 3000');
});
