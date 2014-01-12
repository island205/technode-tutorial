var Controllers = require('../controllers')
var parseSignedCookie = require('connect').utils.parseSignedCookie
var Cookie = require('cookie')
var ObjectId = require('mongoose').Schema.ObjectId
var config = require('../config')

module.exports = function(io, sessionStore) {

  io.set('authorization', function(handshakeData, accept) {
    handshakeData.cookie = Cookie.parse(handshakeData.headers.cookie)
    var connectSid = handshakeData.cookie['connect.sid']
    connectSid = parseSignedCookie(connectSid, 'technode')

    if (connectSid) {
      sessionStore.get(connectSid, function(error, session) {
        if (error) {
          accept(error.message, false)
        } else {
          handshakeData.session = session
          if (session._userId) {
            accept(null, true)
          } else {
            accept('No login')
          }
        }
      })
    } else {
      accept('No session')
    }
  })

  io.sockets.on('connection', function(socket) {
    var _userId = socket.handshake.session._userId
    Controllers.User.online(_userId, function(err, user) {
      if (err) {
        socket.emit('err', {
          mesg: err
        })
      } else {
        if (user._roomId) {
          socket.join(user._roomId)
          socket. in (user._roomId).broadcast.emit('users.join', user)
          socket. in (user._roomId).broadcast.emit('messages.add', {
            content: user.name + '进入了聊天室',
            creator: config.robot,
            createAt: new Date(),
            _id: ObjectId()
          })
        }

      }
    })
    socket.on('disconnect', function() {
      Controllers.User.offline(_userId, function(err, user) {
        if (err) {
          socket.emit('err', {
            mesg: err
          })
        } else {
          if (user._roomId) {
            socket. in (user._roomId).broadcast.emit('users.leave', user)
            socket. in (user._roomId).broadcast.emit('messages.add', {
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
    })
    socket.on('messages.create', function(message) {
      Controllers.Message.create(message, function(err, message) {
        if (err) {
          socket.emit('err', {
            msg: err
          })
        } else {
          socket. in (message._roomId).broadcast.emit('messages.add', message)
          socket.emit('messages.add', message)
        }
      })
    })

    socket.on('rooms.create', function(room) {
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
    })

    socket.on('rooms.read', function(data) {
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
    })

    socket.on('users.join', function(join) {
      Controllers.User.joinRoom(join, function(err) {
        if (err) {
          socket.emit('err', {
            msg: err
          })
        } else {
          socket.join(join.room._id)
          socket.emit('users.join.' + join.user._id, join)
          socket. in (join.room._id).broadcast.emit('messages.add', {
            content: join.user.name + '进入了聊天室',
            creator: config.robot,
            createAt: new Date(),
            _id: ObjectId()
          })
          socket. in (join.room._id).broadcast.emit('users.join', join)
        }
      })
    })

    socket.on('users.leave', function(leave) {
      Controllers.User.leaveRoom(leave, function(err) {
        if (err) {
          socket.emit('err', {
            msg: err
          })
        } else {
          socket. in (leave.room._id).broadcast.emit('messages.add', {
            content: leave.user.name + '离开了聊天室',
            creator: config.robot,
            createAt: new Date(),
            _id: ObjectId()
          })
          socket.leave(leave.room._id)
          io.sockets.emit('users.leave', leave)
        }
      })
    })
  })
}