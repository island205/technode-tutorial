var Controllers = require('../controllers')

module.exports = function(req, res) {
  console.log(req, res)
  if (Controllers.hasOwnProperty(req.route.params.model)) {
    model = req.route.params.model
    controller = Controllers[model]
    switch (req.route.method) {
      case 'post':
        controller.create(req.body, function (err, model) {
          if (err) {
            res.send(500, {error: err})
          } else {
            res.json(model)
          }
        })
        break
      case 'get':
        _id = req.route.params._id || {}
        controller.read(_id, function (err, model) {
          if (err) {
            res.send(500, {error: err})
          } else {
            res.json(model)
          }
        })
        break
      case 'put':
        _id = req.route.params._id
        if (!_id) {
          res.send(500, {error: '_id is need'})
        } else {
          controller.update(_id, req.body, function (err, model) {
            if (err) {
              res.send(500, {error: err})
            } else {
              res.json(model)
            }
          })
        }
        break
      case 'delete':
        _id = req.route.params._id
        if (!_id) {
          res.send(500, {error: '_id is need'})
        } else {
          controller.remove(_id, function (err, model) {
            if (err) {
              res.send(500, {error: err})
            } else {
              res.json(model)
            }
          })
        }
        break
    }
  }
}