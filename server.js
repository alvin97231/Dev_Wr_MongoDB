'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan'); // formerly express.logger
var errorhandler = require('errorhandler');

var async = require('async');
var bodyParser = require('body-parser');

var r = require('rethinkdb');
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

app.route('/users')
  .get(UsersList);

  /*
   * Retrieve all todo items.
   */
  function UsersList(req, res, next) {
    r.table('users').run(req.app._rdbConn, function(err, cursor) {
      if(err) {
        return next(err);
      }

      //Retrieve all the todos in an array.
      cursor.toArray(function(err, result) {
        if(err) {
          return next(err);
        }

        res.json(result);
      });
    });
  }

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
  },
  function createDatabase(connection, callback) {
    //Create the database if needed.
    r.dbList().contains(config.rethinkdb.db).do(function(containsDb) {
      return r.branch(
        containsDb,
        {created: 0},
        r.dbCreate(config.rethinkdb.db)
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  },
  function createTable(connection, callback) {
    //Create the table if needed.
    r.tableList().contains('users').do(function(containsTable) {
      return r.branch(
        containsTable,
        {created: 0},
        r.tableCreate('todos')
      );
    }).run(connection, function(err) {
      callback(err, connection);
    });
  }
], function(err, connection) {
  if(err) {
    console.error(err);
    process.exit(1);
    return;
  }

  startExpress(connection);
});
