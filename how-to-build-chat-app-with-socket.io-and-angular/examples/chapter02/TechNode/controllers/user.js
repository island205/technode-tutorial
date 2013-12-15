var db = require('../models')
var async = require('async')
var gravatar = require('gravatar')

exports.findUserById = function (_userId, callback) {
  db.User.findOne({
    _id: _userId
  }, callback)
}

exports.findByEmailOrCreate = function (email, callback) {
  db.User.findOne({
    email: email
  }, function (err, user) {
    if (user) {
      callback(null, user)
    } else {
      user = new db.User
      user.name = email.split('@')[0]
      user.email = email
      user.avatarUrl = gravatar.url(email)
      user.save(callback)
    }
  })
}

