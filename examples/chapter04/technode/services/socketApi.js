var Controllers = require('../controllers')
var ObjectId = require('mongoose').Schema.ObjectId
var config = require('../config')

exports.connect = function(socket) {
  var _userId = socket.request.session._userId
  if (_userId) {
    Controllers.User.online(_userId, function(err, user) {
      if (err) {
        socket.emit('err', {
          msg: err
        })
      } else {
        if (user._roomId) {
          socket.join(user._roomId)
          socket['in'](user._roomId).broadcast.emit('technode', {
            action: 'joinRoom',
            data: {
              user: user
            }
          })
          socket.emit('technode', {
            action: 'joinRoom',
            data: {
              user: user
            }
          })
          socket['in'](user._roomId).broadcast.emit('technode', {
            action: 'createMessage',
            data: {
              content: user.name + '进入了聊天室',
              creator: config.robot,
              createAt: new Date(),
              _roomId: user._roomId,
              _id: ObjectId()
            }
          })
        }
      }
    })
  }
}

exports.disconnect = function(socket) {
  var _userId = socket.request.session._userId
  if (_userId) {
    Controllers.User.offline(_userId, function(err, user) {
      if (err) {
        socket.emit('err', {
          mesg: err
        })
      } else {
        if (user._roomId) {
          socket['in'](user._roomId).broadcast.emit('technode', {
            action: 'leaveRoom',
            data: {
              user: user,
              room: {
                _id: user._roomIds
              }
            }
          })
          socket['in'](user._roomId).broadcast.emit('technode', {
            action: 'createMessage',
            data: {
              content: user.name + '离开了聊天室',
              creator: config.robot,
              createAt: new Date(),
              _roomId: user._roomId,
              _id: ObjectId()
            }
          })
          Controllers.User.leaveRoom({
            user: user
          }, function() {})
        }

      }
    })
  }
}

exports.createMessage = function(message, socket) {
  Controllers.Message.create(message, function(err, message) {
    if (err) {
      socket.emit('err', {
        msg: err
      })
    } else {
      socket['in'](message._roomId).broadcast.emit('technode', {
        action: 'createMessage',
        data: message
      })
      socket.emit('technode', {
        action: 'createMessage',
        data: message
      })
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
      io.sockets.emit('technode', {
        action: 'createRoom',
        data: room
      })
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
        socket.emit('technode', {
          action: 'getRoom',
          _roomId: data._roomId,
          data: room
        })
      }
    })
  } else {
    Controllers.Room.read(function(err, rooms) {
      if (err) {
        socket.emit('err', {
          msg: err
        })
      } else {
        socket.emit('technode', {
          action: 'getRoom',
          data: rooms
        })
      }
    })
  }
}
exports.joinRoom = function(join, socket) {
  Controllers.User.joinRoom(join, function(err, user) {
    if (err) {
      socket.emit('err', {
        msg: err
      })
    } else {
      join.user = user
      socket.join(user._roomId)
      socket.emit('technode', {
        action: 'joinRoom',
        data: join
      })
      socket['in'](user._roomId).broadcast.emit('technode', {
        action: 'createMessage',
        data: {
          content: user.name + '进入了聊天室',
          creator: config.robot,
          createAt: new Date(),
          _roomId: user._roomId,
          _id: ObjectId()
        }
      })
      socket['in'](user._roomId).broadcast.emit('technode', {
        action: 'joinRoom',
        data: join
      })
    }
  })
}
exports.leaveRoom = function(leave, socket) {
  Controllers.User.leaveRoom(leave, function(err) {
    if (err) {
      socket.emit('err', {
        msg: err
      })
    } else {
      socket['in'](leave.room._id).broadcast.emit('technode', {
        action: 'createMessage',
        data: {
          content: leave.user.name + '离开了聊天室',
          creator: config.robot,
          createAt: new Date(),
          _roomId: leave.room._id,
          _id: ObjectId()
        }
      })
      socket['in'](leave.room._id).broadcast.emit('technode', {
        action: 'leaveRoom',
        data: leave
      })
      socket.emit('technode', {
        action: 'leaveRoom',
        data: leave
      })
      socket.leave(leave.room._id)
    }
  })
}