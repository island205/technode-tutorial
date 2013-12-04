var db = require('../models')
var async = require('async')
var gravatar = require('gravatar')

exports.offline = function(_userId, callback) {
  db.User.findOneAndUpdate({
    _id: _userId
  }, {
    $set: {
      online: false
    }
  }, callback)
}

exports.findByEmail = function(email, callback) {
  db.User.findOne({
    email: email
  }, callback)
}

exports.createByEmail = function(email, callback) {
  var user = new db.User
  user.avatar = gravatar.url(email)
  user.name = email.split('@').shift()
  user.email = email
  user.save(callback)
}

exports.online = function(user, _roomId, callback) {
  user.online = true
  user._roomId = _roomId
  user.save(callback)
}