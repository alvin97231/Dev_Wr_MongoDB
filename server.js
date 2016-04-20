'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan'); // formerly express.logger
var errorhandler = require('errorhandler');

var async = require('async');
var bodyParser = require('body-parser');
var config = require(__dirname + '/config.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

// express/connect middleware
app.use(favicon(__dirname + '/app/favicon.ico'));
app.use(morgan('dev'));

// serve up static assets
app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json());

// development only
if ('development' === app.get('env')) {
  app.use(errorhandler());
}

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function () {
    console.log('WorkingRoom server listening on port ' + app.get('port'));
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');

    socket.on('my other event', function (data) {
      console.log(data);
    });
});
