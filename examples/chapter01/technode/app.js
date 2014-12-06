var express = require('express')
var app = express()
var path = require('path')
var port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '/static')))

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, './static/index.html'))
})

server = app.listen(port, function() {
  console.log('TechNode  is on port ' + port + '!')
})

var io = require('socket.io').listen(server)

var messages = []

io.sockets.on('connection', function(socket) {
  socket.on('messages.read', function() {
    socket.emit('messages.read', messages)
  })
  socket.on('messages.create', function(message) {
    messages.push(message)
    io.sockets.emit('messages.add', message)
  })
})