var r = require('rethinkdb')
  , util = require('util')
  , assert = require('assert')
  , logdebug = require('debug')('rdb:debug')
  , logerror = require('debug')('rdb:error')
  , bcrypt = require('bcrypt')
  , db = require('../../server/db/db');

module.exports = function (socket) {
  onConnect(function (err, connection) {
    r.db(db.dbConfig['db']).table('tickets').changes().run(connection).then(function (cursor) {
        cursor.each(function (err, row) {
          if(row.new_val.tickets.length > row.old_val.tickets.length ){
            socket.emit('new_ticket', {id : row.new_val.id, ticket : row.new_val.tickets[row.new_val.tickets.length -1]});
            console.log('New ticket inserted');
          }
          else if(row.new_val.tickets.length == row.old_val.tickets.length ){
            for (var i = 0; i < row.old_val.tickets.length; i++) {
              if(row.new_val.tickets[i] !== row.old_val.tickets[i]){
                socket.emit('update_ticket', {id : row.new_val.id, ticket : row.new_val.tickets[i]});
              }
            }
            console.log('Ticket updated');
          }
        });
      });
    });

    onConnect(function (err, connection) {
      r.db(db.dbConfig['db']).table('users').changes().run(connection).then(function (cursor) {
         cursor.each(function (err, users) {
           if(users && users.new_val && users.old_val === undefined){
             socket.broadcast.emit('new_user', users.new_val);
             console.log('New user inserted');
           }
           else if(users && users.new_val && users.old_val){
             socket.broadcast.emit('update_user', users.new_val);
             console.log('User updated');
           }
           else if(users && users.new_val === null){
             socket.broadcast.emit('delete_user', users.new_val);
             console.log('User deleted');
           }
         });
       });
     });

     onConnect(function (err, connection) {
       r.db(db.dbConfig['db']).table('modules').changes().run(connection).then(function (cursor) {
            cursor.each(function (err, modules) {
              if(modules && modules.new_val && modules.old_val === undefined){
                socket.broadcast.emit('new_module', modules.new_val);
                console.log('New module inserted');
              }
              else if(modules && modules.new_val && modules.old_val){
                socket.broadcast.emit('update_module', modules.new_val);
                console.log('Module updated');
              }
              else if(modules && modules.new_val === null){
                socket.broadcast.emit('delete_module', modules.old_val);
                console.log('Module deleted');
              }
            });
          });
        });

        onConnect(function (err, connection) {
          r.db(db.dbConfig['db']).table('groups').changes().run(connection).then(function (cursor) {
             cursor.each(function (err, groups) {
               if(groups && groups.new_val && groups.old_val === undefined){
                 socket.broadcast.emit('new_group', groups.new_val);
                 console.log('New group inserted');
               }
               else if(groups && groups.new_val && groups.old_val){
                 socket.broadcast.emit('update_groups', groups.new_val);
                 console.log('Group updated');
               }
               else if(groups && groups.new_val === null){
                 socket.broadcast.emit('delete_group', groups.old_val);
                 console.log('Group deleted');
               }
             });
           });
          });

};

function onConnect(callback) {
  r.connect({host: db.dbConfig.host, port: db.dbConfig.port }, function(err, connection) {
    assert.ok(err === null, err);
    connection['_id'] = Math.floor(Math.random()*10001);
    callback(err, connection);
  });
}
