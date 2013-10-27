var express = require('express')
var app = express();
var port = process.env.PORT || 3000

var rooms = {
  'javascript': {
    name: 'javascript',
    users: []
  },
  'node.js': {
    name: 'node.js',
    users: []
  }
}

app.use(express.static(__dirname + '/webapp'))

var io = require('socket.io').listen(app.listen(port))

io.sockets.on('connection', function (socket) {
  socket.on('read:rooms', function () {
    socket.emit('read:rooms', Object.keys(rooms).map(function (roomName) {
      return {name: roomName}
    }))
  })

  socket.on('add:user', function (user) {
    rooms[user.room].users.push({
      email: user.email,
      socket:socket
    })
    socket.broadcast.emit('add:user', user)
  })
})

console.log("nodechat  is on port " + port + '!')