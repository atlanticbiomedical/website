var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var email = require('emailjs');
var Schema = mongoose.Schema;
var restify = require('express-restify-mongoose');

mongoose.connect('mongodb://localhost/biomed_prod');

var emailServer = email.server.connect({
    user: 'api@atlanticbiomedical.com',
    password: 'success4',
    host: 'smtp.gmail.com',
    ssl: true
});

var Post = new Schema({
    title: { type: String },
    preview: { type: String },
    details: { type: String },
    image: { type: String },
    gallery: [
        { type: String }
    ],
    status: { type: String },
    tags: [{ type: String }]
});
var PostModel = mongoose.model('Post', Post);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.post('/api/email', function(req, res) {

    if (req.body.name && req.body.email && req.body.message) {

        emailServer.send({
            from: 'Website <api@atlanticbiomedical.com>',
            to: 'akirayasha@gmail.com',
            "reply-to": req.body.email,
            subject: 'Message from website',
            text: 'Name: ' + req.body.name + "\n" + "E-Mail: " + req.body.email + "\n\n" + req.body.message
        }, function(err, message) {
            if (err) {
                console.log("Failed to send message from website.", err);
            }
        });

        res.json(null);
    }
});

restify.serve(app, PostModel, {
    prereq: function(req) {
        return req.method === 'GET';
    }
});

http.createServer(app).listen(3000, function() {
    console.log('Express server listening on port 3000');
});
