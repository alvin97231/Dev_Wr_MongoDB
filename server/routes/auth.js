module.exports = function(app) {

    var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , bcrypt = require('bcrypt')
    , db = require('../db/db')
    , session = require('express-session')
    , fs = require('fs')
    , express = require('express')
    , SMTPServer = require('smtp-server').SMTPServer;

    app.use(session({ secret: 'WorkingRoom' }));
    app.use(passport.initialize());

    app.use(passport.session());


    passport.use(new LocalStrategy(
        function(username, password, done) {

            db.findUserByEmail(username, function (err, user) {
              console.log(bcrypt.compareSync(password, user.password));
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {alert: 'Incorrect username.'});
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, {alert: 'Incorrect password.'});
                }
                if (user.email == username && bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                }
            });
        }

    ));

    passport.serializeUser(function(user, done) {
      console.log("[DEBUG][passport][serializeUser] %j", user);
      done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
      db.findUserById(id, done);
    });

    function isAuthenticated(req,res,next){
        if(req.isAuthenticated())return next();
         res.redirect('/');
    }

    app.post('/login', passport.authenticate('local'),function(req, res){
        res.json(req.user);
    });

    app.get('/login', function (req, res) {
      if (req.user && req.user.id) {
        res.json(req.user);
        return;
      }
    });

    app.get('/loggedin', function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.get('/currentuser',isAuthenticated,function(req,res){
        res.json(req.user);
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.send(200);
    });

    var mailServer = new SMTPServer();
    mailServer.listen(8000);
    mailServer.on('error', function(err){
      console.log('Error %s', err.message);
    });
    mailServer.on('connection', function(err){
      console.log('Error %s', err.message);
    });

    var forgot = require('password-reset')({
      uri : 'http://localhost:3000/password_reset',
      from : 'password-robot@localhost',
      host: 'localhost', port : 8000,
    });

    app.post('/forgot', express.bodyParser(), function (req, res) {

      var email = req.body.email;
      var reset = forgot(email, function (err) {
          if (err) {
            console.log(err);
            res.end('Error sending message: ' + err)
          }
          else res.end('Check your inbox for a password reset message.')
        });

      reset.on('request', function (req_, res_) {
        req_.session.reset = { email : email, id : reset.id };
        fs.createReadStream(__dirname + '/forgot.html').pipe(res_);
      });
    });

    app.post('/reset', express.bodyParser(), function (req, res) {
     if (!req.session.reset) return res.end('reset token not set');

     var password = req.body.password;
     var confirm = req.body.confirm;
     if (password !== confirm) return res.end('passwords do not match');

     // update the user db here

     forgot.expire(req.session.reset.id);
     delete req.session.reset;
     res.end('password reset');
    });

};
