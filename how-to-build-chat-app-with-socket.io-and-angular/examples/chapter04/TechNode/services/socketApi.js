var Controllers = require('../controllers')
var httpApi = require('./httpApi')

/*
{
  model: 'users'
  _id: '52b380a837a4f24736000001'
  action: 'add'
  data:{}
}
*/
var methodMap = {
  add: 'post',
  update: 'put',
  remove: 'delete'
}
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
    req.route.method = methodMap[request.action]
    req.body = request.data
    res.json = function (data) {
      console.log(data)
      io.sockets.emit('technode', {
        model: request.model,
        _id: request._id || data._id,
        method: request.action,
        data: data
      })
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