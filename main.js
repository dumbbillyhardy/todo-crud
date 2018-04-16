var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var server = require('http').Server(app);

app.use('/', express.static('./dist'));
server.listen(port);
