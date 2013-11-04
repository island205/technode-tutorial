//http://www.readability.com/articles/ye13gync

var express = require('express')
var gravatar = require('gravatar')
var app = express();
var port = process.env.PORT || 3000

app.use(express.static(__dirname + '/webapp'))

var io = require('socket.io').listen(app.listen(port))

io.sockets.on('connection', require('./socket'))

console.log("nodechat  is on port " + port + '!')