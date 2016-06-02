module.exports = function(app) {

    var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , bcrypt = require('bcrypt')
    , db = require('../db/db')

    , session = require('express-session');

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

};
