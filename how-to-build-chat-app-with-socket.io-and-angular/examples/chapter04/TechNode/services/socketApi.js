var Controllers = require('../controllers')
var ObjectId = require('mongoose').Schema.ObjectId
var config = require('../config')

exports.connect = function(socket) {
  var _userId = socket.handshake.session._userId
  Controllers.User.online(_userId, function(err, user) {
    if (err) {
      socket.emit('err', {
        mesg: err
      })
    } else {
      if (user._roomId) {
        socket.join(user._roomId)
        socket['in'](user._roomId).broadcast.emit('users.join', user)
        socket['in'](user._roomId).broadcast.emit('messages.add', {
          content: user.name + '进入了聊天室',
          creator: config.robot,
          createAt: new Date(),
          _id: ObjectId()
        })
      }
    }
  })
}

exports.disconnect = function(socket) {
  var _userId = socket.handshake.session._userId
  Controllers.User.offline(_userId, function(err, user) {
    if (err) {
      socket.emit('err', {
        mesg: err
      })
    } else {
      if (user._roomId) {
        socket['in'](user._roomId).broadcast.emit('users.leave', user)
        socket['in'](user._roomId).broadcast.emit('messages.add', {
          content: user.name + '离开了聊天室',
          creator: config.robot,
          createAt: new Date(),
          _id: ObjectId()
        })
        Controllers.User.leaveRoom({
          user: user
        }, function() {})
      }

    }
  })
}

exports.createMessage = function(message, socket) {
  Controllers.Message.create(message, function(err, message) {
    if (err) {
      socket.emit('err', {
        msg: err
      })
    } else {
      socket['in'](message._roomId).broadcast.emit('messages.add', message)
      socket.emit('messages.add', message)
    }
  })
}
exports.createRoom = function(room, socket, io) {
  Controllers.Room.create(room, function(err, room) {
    if (err) {
      socket.emit('err', {
        msg: err
      })
    } else {
      room = room.toObject()
      room.users = []
      io.sockets.emit('rooms.add', room)
    }
  })
}
exports.getRoom = function(data, socket) {
  if (data && data._roomId) {
    Controllers.Room.getById(data._roomId, function(err, room) {
      if (err) {
        socket.emit('err', {
          msg: err
        })
      } else {
        socket.emit('rooms.read.' + data._roomId, room)
      }
    })
  } else {
    Controllers.Room.read(function(err, rooms) {
      if (err) {
        socket.emit('err', {
          msg: err
        })
      } else {
        socket.emit('rooms.read', rooms)
      }
    })
  }
}
exports.joinRoom = function(join, socket) {
  Controllers.User.joinRoom(join, function(err) {
    if (err) {
      socket.emit('err', {
        msg: err
      })
    } else {
      socket.join(join.room._id)
      socket.emit('users.join.' + join.user._id, join)
      socket['in'](join.room._id).broadcast.emit('messages.add', {
        content: join.user.name + '进入了聊天室',
        creator: config.robot,
        createAt: new Date(),
        _id: ObjectId()
      })
      socket['in'](join.room._id).broadcast.emit('users.join', join)
    }
  })
}
exports.leaveRoom = function(leave, socket, io) {
  Controllers.User.leaveRoom(leave, function(err) {
    if (err) {
      socket.emit('err', {
        msg: err
      })
    } else {
      socket['in'](leave.room._id).broadcast.emit('messages.add', {
        content: leave.user.name + '离开了聊天室',
        creator: config.robot,
        createAt: new Date(),
        _id: ObjectId()
      })
      socket['in'](leave.room._id).broadcast.emit('users.leave', leave)
      socket.leave(leave.room._id)
    }
  })
}