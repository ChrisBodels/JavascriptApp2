var express = require('express');

var api = express(); 

require('./config/express').addMiddleware(api)
require('./routes')(api)

api.listen(5000, function() {
  console.log('Express server listening.');
});
