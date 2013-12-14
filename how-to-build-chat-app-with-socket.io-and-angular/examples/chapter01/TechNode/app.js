var express = require('express')
var app = express();
var port = process.env.PORT || 3000

app.use(express.static(__dirname + '/static'))

app.use(function (req, res) {
  res.sendfile('./static/index.html')
})

var io = require('socket.io').listen(app.listen(port))

io.sockets.on('connection', function (socket) {
	require('./socket')(socket, io)
})

console.log("TechNode  is on port " + port + '!')
