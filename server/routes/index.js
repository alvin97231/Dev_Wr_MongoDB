var path = require('path');

module.exports = function(app) {

   // basic routes to handle request
    app.get('/', function(req, res) {
      res.redirect('/login')
    });

};
