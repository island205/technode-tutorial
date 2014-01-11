var Controllers = require('../controllers')
var httpApi = require('./httpApi')

/*
{
  model,
  _id,
  method,
  data
}
*/

module.exports = function(socket, io) {
  socket.on('technode', function (request) {
    console.log(request)
    var req = {}
    var res = {}

    req.route = {}
    req.route.params = {
      model: request.model,
      _id: request._id
    }

    req.route.method = request.method

    if (request.method === 'get') {
      req.query = request.data
    } else {
      req.body = request.data
    }

    res.json = function (data) {
      if (request.method === 'get') {
        socket.emit('technode.' + request.requestId, {
          model: request.model,
          _id: request._id || data._id,
          method: request.method,
          data: data
        })
      } else {
        io.sockets.emit('technode', {
          model: request.model,
          _id: request._id || data._id,
          method: request.method,
          data: data
        })
      }
    }

    res.send = function (code, data) {
      console.log(data)
      socket.emit('technode', {
        code: code,
        data: data,
        request: request
      })
    }

    httpApi(req, res)

  })
}