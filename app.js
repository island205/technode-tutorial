//http://www.readability.com/articles/ye13gync

var express = require('express')
var gravatar = require('gravatar')
var app = express();
var port = process.env.PORT || 3000
var fs = require('fs')

app.use(express.static(__dirname + '/webapp'))

app.use(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write(fs.readFileSync('./webapp/index.html'))
  res.end()
})

var io = require('socket.io').listen(app.listen(port))

io.sockets.on('connection', require('./socket'))

console.log("nodechat  is on port " + port + '!')
