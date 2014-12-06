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

var sessionStore = new MongoStore({
  url: 'mongodb://localhost/technode'
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
    maxAge: 60 * 1000
  },
  store: sessionStore
}))

app.use(express.static(path.join(__dirname, '/static')))

app.get('/api/validate', function(req, res) {
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

app.post('/api/login', function(req, res) {
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

app.get('/api/logout', function(req, res) {
  var _userId = req.session._userId
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
    Controllers.Message.create(message, function(err, message) {
      if (err) {
        socket.emit('err', {
          msg: err
        })
      } else {
        io.sockets.emit('messages.add', message)
      }
    })
  })
})