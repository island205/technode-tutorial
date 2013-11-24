var db = require('./models')
var async = require('async')
var gravatar = require('gravatar')
module.exports = function(socket, io) {
  function handerErr(err) {
    socket.emit('err', err)
  }
  socket.on('disconnect', function() {
    if (socket._userId) {
      db.User.findOneAndUpdate({
        _id: socket._userId
      }, {
        $set: {
          online: false
        }
      }, function(err, user) {
        if (err) {
          handerErr(err)
        } else if (user) {
          io.sockets.emit('logout', user)
        }
      })
    }
  })
  socket.on('read:rooms', function() {
    db.Room.find({}, function(err, rooms) {
      if (!err) {
        var roomsData = []
        async.each(rooms, function(room, done) {
          var roomData = room.toObject()
          async.parallel([

              function(done) {
                db.User.find({
                  _roomId: roomData._id,
                  online: true
                }, function(err, users) {
                  done(err, users)
                })
              },
              function(done) {
                db.Message.find({
                  _roomId: roomData._id
                }, null, {
                  sort: {
                    'create_at': -1
                  },
                  limit: 20
                }, function(err, messages) {
                  done(err, messages.reverse())
                })
              }
            ],
            function(err, results) {
              if (err) {
                done(err)
              } else {
                roomData.users = results[0]
                roomData.messages = results[1]
                roomsData.push(roomData)
                done()
              }
            });

        }, function(err) {
          if (!err) {
            socket.emit('read:rooms', roomsData)
          }
        })
      }
    })
  })
  socket.on('login', function(data) {
    function createUser() {
      var user = new db.User
      user.avatar = gravatar.url(data.email)
      user.name = data.email.split('@').shift()
      user.email = data.email
      user._roomId = data.selectedRoom._id
      user.online = true
      user.save(function(err, user) {
        if (err) {
          handerErr(err)
        } else {
          socket.emit('login', user)
          io.sockets.emit('add:user', user)
        }
      })
    }
    db.User.findOne({
      email: data.email
    }, function(err, user) {
      if (err) {
        handerErr(err)
      } else if (user) {
        user.online = true
        user._roomId = data.selectedRoom._id
        user.save(function(err, user) {
          if (err) {
            handerErr(err)
          } else {
            socket._userId = user._id
            socket.emit('login', user)
            io.sockets.emit('add:user', user)
          }
        })
      } else {
        createUser()
      }
    })
  })
  socket.on('add:message', function(message) {
    var m = new db.Message()
    m.content = message.content
    m.creator = message.creator
    m._roomId = message._roomId
    m.save(function(err, message) {
      if (err) {
        handerErr(err)
      } else {
        io.sockets.emit('add:message', message)
      }
    })
  })
  socket.on('create:room', function(room) {
    var r = new db.Room()
    r.name = room.roomName
    r.save(function(err, r) {
      if (err) {
        handerErr(err)
      } else {
        r.users = []
        r.messages = []
        io.sockets.emit('add:room', r)
      }
    })
  })
  socket.on('change:room', function (change) {
    io.sockets.emit('change:room', change)
  })
}