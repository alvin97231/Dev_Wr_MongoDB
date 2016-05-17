// A fork of the [node.js chat app](https://github.com/eiriksm/chat-test-2k)
// by [@orkj](https://twitter.com/orkj) using socket.io, rethinkdb, passport and bcrypt on an express app.
//
// See the [GitHub README](https://github.com/rethinkdb/rethinkdb-example-nodejs-chat/blob/master/README.md)
// for details of the complete stack, installation, and running the app.

var r = require('rethinkdb')
  , util = require('util')
  , assert = require('assert')
  , logdebug = require('debug')('rdb:debug')
  , logerror = require('debug')('rdb:error')
  , bcrypt = require('bcrypt');


// #### Connection details

// RethinkDB database settings. Defaults can be overridden using environment variables.
var dbConfig = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015,
  db  : process.env.RDB_DB || 'test',
  expressport :3000,
  tables: {}
};
module.exports.dbConfig = dbConfig;
/**
 * Connect to RethinkDB instance and perform a basic database setup:
 *
 * - create the `RDB_DB` database (defaults to `chat`)
 * - create tables `messages`, `cache`, `users` in this database
 */
module.exports.setup = function() {
  r.connect({host: dbConfig.host, port: dbConfig.port }, function (err, connection) {
    assert.ok(err === null, err);
    r.dbCreate(dbConfig.db).run(connection, function(err, result) {
      if(err) {
        logdebug("[DEBUG] RethinkDB database '%s' already exists (%s:%s)\n%s", dbConfig.db, err.name, err.msg, err.message);
      }
      else {
        logdebug("[INFO ] RethinkDB database '%s' created", dbConfig.db);
      }

      for(var tbl in dbConfig.tables) {
        (function (tableName) {
          r.db(dbConfig.db).tableCreate(tableName, {primaryKey: dbConfig.tables[tbl]}).run(connection, function(err, result) {
            if(err) {
              logdebug("[DEBUG] RethinkDB table '%s' already exists (%s:%s)\n%s", tableName, err.name, err.msg, err.message);
            }
            else {
              logdebug("[INFO ] RethinkDB table '%s' created", tableName);
            }
          });
        })(tbl);
      }
    });
  });
};

// #### Filtering results

/**
 * Find a user by email using the
 * [`filter`](http://www.rethinkdb.com/api/javascript/filter/) function.
 * We are using the simple form of `filter` accepting an object as an argument which
 * is used to perform the matching (in this case the attribute `mail` must be equal to
 * the value provided).
 *
 * We only need one result back so we use [`limit`](http://www.rethinkdb.com/api/javascript/limit/)
 * to return it (if found). The result is collected with [`next`](http://www.rethinkdb.com/api/javascript/next/)
 * and passed as an array to the callback function.
 *
 * @param {String} mail
 *    the email of the user that we search for
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Object} the user if found, `null` otherwise
 */
module.exports.findUserByEmail = function (mail, callback) {
  onConnect(function (err, connection) {
    logdebug("[INFO ][%s][findUserByEmail] Login {user: %s, pwd: 'you really thought I'd log it?'}", connection['_id'], mail);
    r.db(dbConfig.db).table('users').filter({'email': mail}).limit(1).run(connection, function(err, cursor) {
      if(err) {
        logerror("[ERROR][%s][findUserByEmail][collect] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(err);
      }
      else {
        cursor.next(function (err, row) {
          if(err) {
            logerror("[ERROR][%s][findUserByEmail][collect] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
            callback(null, null); // no user, cursor is empty
          }
          else {
            callback(null, row);
          }
          connection.close();
        });
      }
    });
  });
};

/**
 * Every user document is assigned a unique id when created. Retrieving
 * a document by its id can be done using the
 * [`get`](http://www.rethinkdb.com/api/javascript/get/) function.
 *
 * RethinkDB will use the primary key index to fetch the result.
 *
 * @param {String} userId
 *    The ID of the user to be retrieved.
 *
 * @param {Function} callback
 *    callback invoked after collecting all the results
 *
 * @returns {Object} the user if found, `null` otherwise
 */
module.exports.findUserById = function (userId, callback) {
  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('users').get(userId).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][findUserById] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(null, null);
      }
      else {
        callback(null, result);
      }
      connection.close();
    });
  });
};

module.exports.UsersList = function (req, res, next) {
  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('users').run(req.app._rdbConn, function(err, cursor) {
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
  });
};

module.exports.ModulesList = function (req, res, next) {
  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('modules').run(req.app._rdbConn, function(err, cursor) {
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
  });
};

module.exports.GroupsList = function (req, res, next) {
  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('groups').run(req.app._rdbConn, function(err, cursor) {
      if(err) {
        return next(err);
      }
      cursor.toArray(function(err, result) {
        if(err) {
          return next(err);
        }
        res.json(result);
      });
    });
  });
};

module.exports.TicketsList = function (req, res, next) {
  var moduleId = req.params.id;
  onConnect(function (err, connection) {
      r.db(dbConfig.db).table('tickets').get(moduleId)("tickets").run(req.app._rdbConn, function(err, cursor) {
        if(err) {
          return next(err);
        }
        cursor.toArray(function(err, result) {
          if(err) {
            return next(err);
          }
          res.json(result);
        });
      });
  });
};


module.exports.GetModule = function (req, res, next) {
  var moduleId = req.params.id;
  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('modules').get(moduleId).run(req.app._rdbConn, function(err, cursor) {
      if(err) {
        return next(err);
      }
      if(cursor){
        cursor.toArray(function(err, result) {
          if(err) {
            return next(err);
          }
          res.json(result);
        });
      }
    });
  });
};

module.exports.GetUser = function (req, res, next) {

  var userId = req.params.id;

  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('users').get(userId).run(req.app._rdbConn, function(err, cursor) {
      if(err) {
        return next(err);
      }
      if(cursor){
        cursor.toArray(function(err, result) {
          if(err) {
            return next(err);
          }
          res.json(result);
        });
      }
    });
  });
};


module.exports.AddTicket = function (req, res, next) {

  var newTicket = req.body;
  var moduleId = req.params.id;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('tickets').get(moduleId).update({
      'tickets': r.row('tickets').append(newTicket)
    }).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};

module.exports.AddGroup = function (req, res, next) {

  var Group = req.body;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('groups').insert(Group).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};

module.exports.AddUser = function (req, res, next) {

  var User = req.body;
  User.password = bcrypt.hashSync('workingRoom', 10);

  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('counter')('userCounter').run(req.app._rdbConn, function(err, cursor) {
      if(err) {
        return next(err);
      }
      if(cursor){
        cursor.next(function(err, result) {
          if(err) {
            return next(err);
          }
          User.id = result;
          r.db(dbConfig['db']).table('users').insert(User).run(connection, function(err, result2) {
            if(err) {
              logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
              return next(err);
            }
            else {
              counter = User.id +1;
              r.db(dbConfig.db).table('counter').get('33b255d6-067f-47e0-b1ed-affe126ac0e7').update({userCounter : counter}).run(connection, function(err, result) {
                if(err) {
                  logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                  return next(err);
                }
                else {
                  res.json({success: true});
                }
              });
              res.json({success: true});
            }
          });
        });
      }
    });
  });
};

module.exports.AddModule = function (req, res, next) {

  var Module = req.body;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('modules').insert(Module).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};


module.exports.UpdateTicket = function (req, res, next) {

  var Ticket = req.body;
  var moduleId = req.params.id;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('tickets').get(moduleId).update({
      'tickets': r.row('tickets').map(function (ticket) {
                          return r.branch(
                                          ticket('id').eq(Ticket.id),
                                          // 2. The change you want to perform on the matching elements
                                          ticket.merge(Ticket),
                                          ticket)
                      })
    }).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};

module.exports.UpdateModule = function (req, res, next) {

  var Module = req.body;
  var moduleId = req.params.id;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('modules').get(moduleId).update(Module).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};

module.exports.UpdateGroup = function (req, res, next) {

  var Group = req.body;
  var groupId = req.params.id;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('groups').get(groupId).update(Group).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};

module.exports.UpdateUser = function (req, res, next) {

  var User = req.body;
  var userId = req.params.id;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('users').get(userId).update(User).run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};


module.exports.DeleteUser = function (req, res, next) {

  var userId = req.params.id;
  console.log('Suppresion de l\'utilisateur '+userId);

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('users').get(userId).delete().run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};

module.exports.DeleteGroup = function (req, res, next) {

  var groupId = req.params.id;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('groups').get(groupId).delete().run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};

module.exports.DeleteModule = function (req, res, next) {

  var moduleId = req.params.id;

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('modules').get(moduleId).delete().run(connection, function(err, result) {
      if(err) {
        logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        return next(err);
      }
      else {
        console.log(result);
        res.json({success: true});
      }
    });
  });
};



// #### Helper functions

/**
 * A wrapper function for the RethinkDB API `r.connect`
 * to keep the configuration details in a single function
 * and fail fast in case of a connection error.
 */
function onConnect(callback) {
  r.connect({host: dbConfig.host, port: dbConfig.port }, function(err, connection) {
    assert.ok(err === null, err);
    connection['_id'] = Math.floor(Math.random()*10001);
    callback(err, connection);
  });
}

// #### Connection management
//
// This application uses a new connection for each query needed to serve
// a user request. In case generating the response would require multiple
// queries, the same connection should be used for all queries.
//
// Example:
//
//     onConnect(function (err, connection)) {
//         if(err) { return callback(err); }
//
//         query1.run(connection, callback);
//         query2.run(connection, callback);
//     }
//
