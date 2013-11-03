//http://www.readability.com/articles/ye13gync

var express = require('express')
var gravatar = require('gravatar')
var app = express();
var port = process.env.PORT || 3000

var users = {
}

var rooms = {
  'javascript': {
    name: 'javascript',
    users: [],
    messages:[]
  },
  'nodejs': {
    name: 'nodejs',
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
    user.id = guid('user')
    user.name = user.email.split('@').shift()
    users[user.email] = user
    rooms[user.room].users.push(user)
    io.sockets.emit('add:user', user)
    socket.emit('login', user)
  })
  socket.on('add:message', function (message) {
    rooms[message.user.room].messages.push(message)
    io.sockets.emit('add:message', message)
  })
  socket.on('update:user', function (user) {
    var oldRoom = users[user.email].room
    users[user.email] = user
    if (oldRoom != user.room) {
      rooms[oldRoom].users = rooms[oldRoom].users.filter(function (u) {
        return user.email != u.email
      })
      rooms[user.room].users.push(user)
      io.sockets.emit('changeRoom:user', [user, oldRoom])
    }
  })
})

var _guid = 0
function guid(prefix) {
  return prefix + (_guid++)
}

console.log("nodechat  is on port " + port + '!')

function generateUser(user) {

}