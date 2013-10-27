var express = require('express')
var app = express();
var port = process.env.PORT || 3000

app.use(express.static(__dirname + '/webapp'))

var io = require('socket.io').listen(app.listen(port))

console.log("nodechat  is on port " + port + '!')