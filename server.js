'use strict';

//==================================================================
// Define variables
//==================================================================
var express = require('express')
, http = require('http')
, path = require('path')
, favicon = require('serve-favicon')
, passport = require('passport')
, flash    = require('connect-flash')
, local = require('passport-local').Strategy
, morgan = require('morgan')
, errorhandler = require('errorhandler')
, db = require('./server/db/db')

, async = require('async')
, bodyParser = require('body-parser')
, methodOverride = require('method-override')
, session = require('express-session')

, r = require('rethinkdb')
, routes = require(__dirname + '/server/routes')

, app = express()
, server = require('http').createServer(app)
, io = require('socket.io')(server);
//, redis = require('socket.io-redis');

//io.adapter(redis({host: 'localhost',port: 6379}));
//io.set('transports', ['websocket', 'polling']);
io.on('connection', require('./server/socket/socket'));
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
app.use(bodyParser.json({limit : '10mb'}));
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
  server.listen(db.dbConfig.expressport);
  console.log('Listening on port ' + db.dbConfig.expressport);
}

async.waterfall([
  function connect(callback) {
    r.connect({host: db.dbConfig.host, port: db.dbConfig.port }, callback);
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
