//http://www.readability.com/articles/ye13gync

var express = require('express')
var gravatar = require('gravatar')
var app = express();
var port = process.env.PORT || 3000
var fs = require('fs')

app.use(express.static(__dirname + '/webapp'))

var indexPage = fs.readFileSync('./webapp/index.html')

app.use(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write(indexPage)
  res.end()
})

var io = require('socket.io').listen(app.listen(port))

io.sockets.on('connection', function (socket) {
	require('./socket')(socket, io)
})

console.log("TechNode  is on port " + port + '!')
