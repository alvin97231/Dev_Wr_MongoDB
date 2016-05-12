'use strict';

//==================================================================
// Define variables
//==================================================================
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var flash    = require('connect-flash');
var local = require('passport-local').Strategy;
var morgan = require('morgan'); // formerly express.logger
var errorhandler = require('errorhandler');
var db = require('./server/db/db');

var async = require('async');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
//var router = require('router');

var r = require('rethinkdb');
var config = require(__dirname + '/server/db/config.js');
var routes = require(__dirname + '/server/routes');

var app = express();
//==================================================================




/******************************************************************
************************ Configuration ****************************
*******************************************************************/
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, '/app'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//

// express/connect middleware
app.use(favicon(__dirname + '/app/favicon.ico'));
app.use(morgan('dev'));

// serve up static assets
app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser());
app.use(methodOverride());

// required for passport
app.use(session({ secret: 'WorkingRoom' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in sessio
//==================================================================



/******************************************************************
********************* Setup the RethinkDB *************************
*******************************************************************/
db.setup();
//==================================================================



/******************************************************************
********* Define the strategy to be used by PassportJS*************
*******************************************************************/
require('./server/routes/index')(app);
require('./server/routes/auth')(app);
//==================================================================


/******************************************************************
*************************** API ************************************
*******************************************************************/
app.get('/users', db.UsersList);
app.get('/users/:id', db.GetUser);
app.post('/users', db.AddUser);
app.put('/users/:id', db.UpdateUser);
app.delete('/users/:id', db.DeleteUser);

app.get('/modules', db.ModulesList);
app.get('/modules/:id', db.GetModule);
app.post('/modules', db.AddModule);
app.put('/modules/:id', db.UpdateModule);
app.delete('/modules/:id', db.DeleteModule);

app.get('/groups', db.GroupsList);
app.post('/groups', db.AddGroup);
app.put('/groups/:id', db.UpdateGroup);
app.delete('/groups/:id', db.DeleteGroup);

app.get('/tickets/:id', db.TicketsList);
app.post('/tickets/:id', db.AddTicket);
app.put('/tickets/:id', db.UpdateTicket);
//==================================================================



// development only
if ('development' === app.get('env')) {
  app.use(errorhandler());
}

function startExpress(connection) {
  app._rdbConn = connection;
  app.listen(config.express.port);
  console.log('Listening on port ' + config.express.port);
}

async.waterfall([
  function connect(callback) {
    r.connect(config.rethinkdb, callback);
  }
], function(err, connection) {
  if(err) {
    console.error(err);
    process.exit(1);
    return;
  }

  startExpress(connection);
});
exports = module.exports = app;
