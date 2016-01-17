var Controllers = require('../controllers')

exports.login = function(req, res) {
  var email = req.body.email
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
}

exports.logout = function(req, res) {
  var _userId = req.session._userId
  Controllers.User.offline(_userId, function(err, user) {
    if (err) {
      res.json(500, {
        msg: err
      })
    } else {
      res.json(200)
      req.session.destroy()
    }
  })
}

exports.validate = function(req, res) {
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
}