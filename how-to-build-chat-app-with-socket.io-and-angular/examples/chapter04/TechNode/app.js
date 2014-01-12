var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var MongoStore = require('connect-mongo')(express)
var api = require('./services/api')
var config = require('./config')

var sessionStore = new MongoStore({
  url: config.mongodb
})

app.use(express.bodyParser())
app.use(express.cookieParser())

app.use(express.session({
  secret: 'technode',
  cookie: {
    maxAge: 60 * 1000 * 60
  },
  store: sessionStore
}))

app.use(express.static(__dirname + '/static'))

app.use(function(req, res) {
  res.sendfile('./static/index.html')
})

app.post('/api/login', api.login)
app.get('/api/logout', api.logout)
app.get('/api/validate', api.validate)

var io = require('socket.io').listen(app.listen(port))

require('./services/socket')(io, sessionStore)

console.log("TechNode  is on port " + port + '!')