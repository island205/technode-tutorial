//http://www.readability.com/articles/ye13gync

var express = require('express')
var gravatar = require('gravatar')
var app = express();
var port = process.env.PORT || 3000

var rooms = {
  'javascript': {
    name: 'javascript',
    users: [],
    messages:[]
  },
  'node.js': {
    name: 'node.js',
    users: [],
    messages:[]
  }
}

app.use(express.static(__dirname + '/webapp'))

var io = require('socket.io').listen(app.listen(port))

io.sockets.on('connection', function (socket) {
  socket.on('read:rooms', function () {
    socket.emit('read:rooms', rooms)
  })

  socket.on('add:user', function (user) {
    user.avatar = gravatar.url(user.email)
    user.name = user.email.split('@').shift()
    rooms[user.room].users.push(user)
    io.sockets.emit('add:user', user)
  })
  socket.on('add:message', function (message) {
    rooms[message.user.room].messages.push(message)
    io.sockets.emit('add:message', message)
  })
})

console.log("nodechat  is on port " + port + '!')

function generateUser(user) {

}