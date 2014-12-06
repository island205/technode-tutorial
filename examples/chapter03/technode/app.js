var express = require('express')
var async = require('async')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var app = express()
var path = require('path')
var port = process.env.PORT || 3000
var Controllers = require('./controllers')
var signedCookieParser = cookieParser('technode')
var MongoStore = require('connect-mongo')(session)
var ObjectId = require('mongoose').Schema.ObjectId

var sessionStore = new MongoStore({
  url: 'mongodb://localhost/technodechapter02'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())
app.use(session({
  secret: 'technode',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000 * 60
  },
  store: sessionStore
}))

app.use(express.static(path.join(__dirname, '/static')))

app.get('/ajax/validate', function(req, res) {
  var _userId = req.session._userId
  if (_userId) {
    Controllers.User.findUserById(_userId, function(err, user) {
      if (err) {
        res.json(401, {
          msg: err
        })
      } else {
        res.json(user)
      }
    })
  } else {
    res.status(401).json(null)
  }
})

app.post('/ajax/login', function(req, res) {
  email = req.body.email
  if (email) {
    Controllers.User.findByEmailOrCreate(email, function(err, user) {
      if (err) {
        res.json(500, {
          msg: err
        })
      } else {
        req.session._userId = user._id
        Controllers.User.online(user._id, function(err, user) {
          if (err) {
            res.json(500, {
              msg: err
            })
          } else {
            res.json(user)
          }
        })
      }
    })
  } else {
    res.json(403)
  }
})

app.get('/ajax/logout', function(req, res) {
  var _userId = req.session._userId
  Controllers.User.offline(_userId, function(err, user) {
    if (err) {
      res.json(500, {
        msg: err
      })
    } else {
      res.json(200)
      delete req.session.destroy()
    }
  })
})

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, './static/index.html'))
})

var server = app.listen(port, function() {
  console.log('TechNode  is on port ' + port + '!')
})

var io = require('socket.io').listen(server)

io.set('authorization', function(handshakeData, accept) {
  signedCookieParser(handshakeData, {}, function(err) {
    if (err) {
      accept(err, false)
    } else {
      sessionStore.get(handshakeData.signedCookies['connect.sid'], function(err, session) {
        if (err) {
          accept(err.message, false)
        } else {
          handshakeData.session = session
          if (session._userId) {
            accept(null, true)
          } else {
            accept('No login')
          }
        }
      })
    }
  })
})

var SYSTEM = {
  name: 'technode机器人',
  avatarUrl: 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/220px-Robot_icon.svg.png'
}

io.sockets.on('connection', function(socket) {
  var _userId = socket.request.session._userId
  Controllers.User.online(_userId, function(err, user) {
    if (err) {
      socket.emit('err', {
        mesg: err
      })
    } else {
      if (user._roomId) {
        socket.join(user._roomId)
        socket.in(user._roomId).broadcast.emit('users.join', user)
        socket.in(user._roomId).broadcast.emit('messages.add', {
          content: user.name + '进入了聊天室',
          creator: SYSTEM,
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
          socket.in(user._roomId).broadcast.emit('users.leave', user)
          socket.in(user._roomId).broadcast.emit('messages.add', {
            content: user.name + '离开了聊天室',
            creator: SYSTEM,
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
        socket.in(message._roomId).broadcast.emit('messages.add', message)
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
        socket.in(join.room._id).broadcast.emit('messages.add', {
          content: join.user.name + '进入了聊天室',
          creator: SYSTEM,
          createAt: new Date(),
          _id: ObjectId()
        })
        socket.in(join.room._id).broadcast.emit('users.join', join)
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
        socket.in(leave.room._id).broadcast.emit('messages.add', {
          content: leave.user.name + '离开了聊天室',
          creator: SYSTEM,
          createAt: new Date(),
          _id: ObjectId()
        })
        socket.leave(leave.room._id)
        io.sockets.emit('users.leave', leave)
      }
    })
  })
})