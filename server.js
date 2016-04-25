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
var session = require('express-session');
//var router = require('router');

var r = require('rethinkdb');
var config = require(__dirname + '/server/db/config.js');
var routes = require(__dirname + '/server/routes');

var app = express();
//==================================================================


//==================================================================
// Define the strategy to be used by PassportJS
//==================================================================

passport.use(new local(
  function(username, password, done) {
    // asynchronous verification, for effect...

      var validateUser = function (err, user) {
        if (err) { return done(err); console.log('Error validateUser');}
        if (!user) { return done(null, false, {message: 'Unknown user: ' + username});console.log('Error validateUser');}

        if (user.email == username && user.password == password) {return done(null, user);console.log('users Ok!');}
        else {
          return done(null, false, {message: 'Invalid username or password'});
          console.log('Error validateUser');
        }
      };

      db.findUserByEmail(username, validateUser);
      console.log(validateUser);
  }
));

passport.serializeUser(function(user, done) {
  console.log("[DEBUG][passport][serializeUser] %j", user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.findUserById(id, done);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated())
  	res.send(401);
  else
  	next();
};
//==================================================================


//==================================================================
// Define environments
//==================================================================
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

// express/connect middleware
app.use(favicon(__dirname + '/app/favicon.ico'));
app.use(morgan('dev'));

// serve up static assets
app.use(express.static(__dirname+'/app'));
app.use(bodyParser.json());

// required for passport
app.use(session({ secret: 'WorkingRoom' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//==================================================================

// set up the RethinkDB database
db.setup();

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.post('/login', passport.authenticate('local'), function(req, res) {
  console.log(res, req);
  res.redirect('/');
});

app.route('/users')
  .get(db.UsersList);


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
