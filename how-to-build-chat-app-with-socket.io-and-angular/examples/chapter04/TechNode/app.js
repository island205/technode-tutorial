var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var httpApi = require('./services/httpApi')
var socketApi = require('./services/socketApi')

app.use(express.bodyParser())

app.use(express.static(__dirname + '/static'))

app.all('/api/:model/:_id?', httpApi)

app.use(function(req, res) {
  res.sendfile('./static/index.html')
})

var io = require('socket.io').listen(app.listen(port))

io.sockets.on('connection', function (socket) {
  socketApi(socket, io)
})

console.log("TechNode  is on port " + port + '!')