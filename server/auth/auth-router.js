var express = require('express');
var authControllers = require('./auth-controller');
var auth = require('./index');
var authRouter = express.Router();

// Local
authRouter.use('/login/callback/local', auth.authenticate('local'), function (req, res) {
  res.redirect('/');
});
authRouter.post('/login/local', auth.authenticate('local'));

// All
authRouter.use('/user', authControllers.getUser);
authRouter.use('/logout', authControllers.logout);

module.exports = authRouter;
