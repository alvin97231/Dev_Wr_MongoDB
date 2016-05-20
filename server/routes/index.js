var path = require('path');

module.exports = function(app) {

   // basic routes to handle request
    app.get('/', function(req, res) {
            res.sendFile(path.join(__dirname, '../../app', 'login.html'));
    });

};
