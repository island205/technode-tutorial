var express = require('express')
var async = require('async')
var app = express()
var port = process.env.PORT || 3000
var Controllers = require('./controllers')
var parseSignedCookie = require('connect').utils.parseSignedCookie
var MemoryStore = require('connect').session.MemoryStore
var Cookie = require('cookie')

var sessionStore = new MemoryStore()

app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.session({
  secret: 'technode',
  cookie: {
    maxAge: 60 * 1000
  },
  store: sessionStore
}))

app.use(express.static(__dirname + '/static'))

app.get('/ajax/validate', function(req, res) {
  _userId = req.session._userId
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
    res.json(401, null)
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
  _userId = req.session._userId
  Controllers.User.offline(_userId, function(err, user) {
    if (err) {
      res.json(500, {
        msg: err
      })
    } else {
      res.json(200)
      delete req.session._userId
    }
  })
})

app.use(function(req, res) {
  res.sendfile('./static/index.html')
})

var io = require('socket.io').listen(app.listen(port))

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

var SYSTEM = {
  name: 'technode机器人',
  avatarUrl: 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/220px-Robot_icon.svg.png'
}

io.sockets.on('connection', function(socket) {
  _userId = socket.handshake.session._userId
  Controllers.User.online(_userId, function(err, user) {
    if (err) {
      socket.emit('err', {
        mesg: err
      })
    } else {
      socket.broadcast.emit('users.add', user)
      socket.broadcast.emit('messages.add', {
        content: user.name + '进入了聊天室',
        creator: SYSTEM,
        createAt: new Date()
      })
    }
  })
  socket.on('disconnect', function() {
    Controllers.User.offline(_userId, function(err, user) {
      if (err) {
        socket.emit('err', {
          mesg: err
        })
      } else {
        socket.broadcast.emit('users.remove', user)
        socket.broadcast.emit('messages.add', {
          content: user.name + '离开了聊天室',
          creator: SYSTEM,
          createAt: new Date()
        })
      }
    })
  });
  socket.on('technode.read', function() {
    async.parallel([
      function(done) {
        Controllers.User.getOnlineUsers(done)
      },
      function(done) {
        Controllers.Message.read(done)
      }
    ],
    function(err, results) {
      if (err) {
        socket.emit('err', {
          msg: err
        })
      } else {
        socket.emit('technode.read', {
          users: results[0],
          messages: results[1]
        })
      }
    });
  })
  socket.on('messages.create', function(message) {
    Controllers.Message.create(message, function (err, message) {
      if (err) {
        socket.emit('err', {msg: err})
      } else {
        io.sockets.emit('messages.add', message)
      }
    })
  })
})

console.log("TechNode  is on port " + port + '!')