var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var app = express()
var path = require('path')
var signedCookieParser = cookieParser('technode')
var MongoStore = require('connect-mongo')(session)

var config = require('./config')
var api = require('./services/api')
var socketApi = require('./services/socketApi')

var port = process.env.PORT || 3000
var sessionStore = new MongoStore({
  url: config.mongodb
})

var app = express()

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

if ('development' == app.get('env')) {
  app.set('staticPath', '/static')
} else {
  app.set('staticPath', '/build')
}

app.use(express.static(__dirname + app.get('staticPath')))

app.post('/api/login', api.login)
app.get('/api/logout', api.logout)
app.get('/api/validate', api.validate)

app.use(function(req, res) {
    res.sendFile(path.join(__dirname, app.get('staticPath') + '/index.html'))
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

io.sockets.on('connection', function(socket) {

  socketApi.connect(socket)

  socket.on('disconnect', function() {
    socketApi.disconnect(socket)
  })

  socket.on('technode', function(request) {
    socketApi[request.action](request.data, socket, io)
  })
})