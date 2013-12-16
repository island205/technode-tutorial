var express = require('express')
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
        res.json(user)
      }
    })
  } else {
    res.josn(403)
  }
})

app.get('/ajax/logout', function(req, res) {
  req.session._userId = null
  res.json(401)
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


var messages = []

io.sockets.on('connection', function(socket) {
  socket.on('messages.read', function() {
    socket.emit('messages.read', messages)
  })
  socket.on('messages.create', function(message) {
    messages.push(message)
    io.sockets.emit('messages.add', message)
  })
})

console.log("TechNode  is on port " + port + '!')