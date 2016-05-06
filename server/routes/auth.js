module.exports = function(app) {

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var db = require('../db/db');

    var session = require('express-session');

    app.use(session({ secret: 'WorkingRoom' }));
    app.use(passport.initialize());

    app.use(passport.session());


    passport.use(new LocalStrategy(
        function(username, password, done) {

            db.findUserByEmail(username, function (err, user) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {alert: 'Incorrect username.'});
                }
                if (user.password != password) {
                    return done(null, false, {alert: 'Incorrect password.'});
                }
                if (user.email == username && user.password == password) {
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

    /*app.post('/auth/signup',function(req,res){

        var u =  new User();
        u.username = req.body.email;
        u.password = req.body.password;
        u.lastname = req.body.lastname;
        u.firstname = req.body.firstname;
        u.email = req.body.email;

        u.save(function(err){
            if (err) {
                res.json({'alert':'Registration error'});
            }else{
                res.json({'alert':'Registration success'});
            }
        });
    });*/

     app.get('/logout', function(req, res){
        req.logout();
        res.send(200);
        res.redirect('/login');
     });

};
