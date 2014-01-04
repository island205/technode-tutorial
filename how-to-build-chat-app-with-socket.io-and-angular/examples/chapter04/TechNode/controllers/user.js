var db = require('../models')
var _ = require('underscore')
var gravatar = require('gravatar')

exports.create = function(user, callback) {
  user.name = user.name || user.email.split('@')[0]
  user.avatarUrl = user.avatarUrl || gravatar.url(user.email)
  user = new db.User(user)
  user.save(callback)
}
exports.remove = function (_userId, callback) {
  db.User.findByIdAndRemove(_userId, callback)
}
exports.update = function (_userId, update, callback) {
  db.User.findByIdAndUpdate(_userId, update, callback)
}
exports.read = function (_userId, callback) {
  if (_.isObject(_userId)) {
    db.User.find(_userId, callback)
  } else {
    db.User.findById(_userId, callback)
  }
}