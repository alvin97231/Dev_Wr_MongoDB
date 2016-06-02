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
    connection.close();
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
    connection.close();
  });
};

module.exports.AddUser = function (req, res, next) {

  var User = req.body;
  User.password = bcrypt.hashSync('workingRoom', 10);

  onConnect(function (err, connection) {
    r.db(dbConfig.db).table('counter').get('ea507c88-ed43-4833-b3ec-b2b7948c8a51').run(req.app._rdbConn, function(err, result) {
      if(err) {
        return next(err);
      }
      if(result){
        User.id = result.usersCounter;
        r.db(dbConfig['db']).table('users').insert(User).run(connection, function(err, result2) {
          if(err) {
            logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
            return next(err);
          }
          else {
            counter = User.id +1;
            r.db(dbConfig.db).table('counter').get('ea507c88-ed43-4833-b3ec-b2b7948c8a51').update({userCounter : counter}).run(connection, function(err, result) {
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
                                          ticket.merge(Ticket),ticket)
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
    if (User.name) {
      r.db(dbConfig['db']).table('users').get(userId).update({
        "name": User.name,
        "email":User.email,
        "groups": User.groups,
        "type": User.type,
        "password": User.password
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
    }

    else if (User.newPassword) {
      r.db(dbConfig['db']).table('users').get(userId).run(connection, function(err, result) {
        if(err) {
          logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
          return next(err);
        }
        else if (result) {
          if(bcrypt.compareSync(User.oldPassword, result.password)){
            console.log(User);
            r.db(dbConfig['db']).table('users').get(userId).update({password: bcrypt.hashSync(User.newPassword, 10)}).run(connection, function(err, result) {
              if(err) {
                logerror("[ERROR][%s][saveMessage] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                return next(err);
              }
              else {
                console.log(result);
                res.json({success: true});
              }
            });
          }
        }
      });
    }
  });

  };

module.exports.DeleteUser = function (req, res, next) {

  var userId = req.params.id;
  console.log('Suppresion de l\'utilisateur '+userId);

  onConnect(function (err, connection) {
    r.db(dbConfig['db']).table('users').filter(r.row('id').eq(userId)).delete().run(connection, function(err, result) {
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
