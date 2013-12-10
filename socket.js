Controller = require('./controllers')
_ = require('underscore')

module.exports = function(socket, io) {

  function handerErr(err) {
    socket.emit('err', err)
  }

  socket.on('disconnect', function() {
    if (socket._userId) {
      Controller.User.offline(socket._userId, function(err, user) {
        if (err) {
          handerErr(err)
        } else if (user) {
          io.sockets.emit('logout', user)
        }
      })
    }
  })

  socket.on('read:rooms', function() {
    Controller.Room.read(function(err, rooms) {
      if (err) {
        handerErr(err)
      } else {
        socket.emit('read:rooms', rooms)
      }
    })
  })

  socket.on('login', function(data) {
    var email = data.email
    var _roomId = null
    if (_.isString(data.selectedRoom)) {
      _roomId = data.selectedRoom._id
    }
    Controller.User.findByEmailOrCreate(data.email, _roomId, function(err, user) {
      if (err) {
        handerErr(err)
      } else {
        socket._userId = user._id
        socket.emit('login', user)
        io.sockets.emit('add:user', user)
      }
    })
  })

  socket.on('add:message', function(message) {
    Controller.Message.create(message, function(err, message) {
      if (err) {
        handerErr(err)
      } else {
        io.sockets.emit('add:message', message)
      }
    })
  })

  socket.on('create:room', function(room) {
    Controller.Room.create(room, function(err, room) {
      if (err) {
        handerErr(err)
      } else {
        room.users = []
        room.messages = []
        io.sockets.emit('add:room', room)
      }
    })
  })

  socket.on('change:room', function(change) {
    io.sockets.emit('change:room', change)
  })
}