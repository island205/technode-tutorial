var db = require('../models')
var _ = require('underscore')

exports.create = function(message, callback) {
  var message = new db.Message(message)
  message.save(callback)
}
exports.remove = function (_messageId, callback) {
  db.Message.findByIdAndRemove(_messageId, callback)
}
exports.update = function (_messageId, update, callback) {
  db.Message.findByIdAndUpdate(_messageId, update, callback)
}
exports.read = function (_messageId, callback) {
  if (_.isObject(_messageId)) {
    db.Message.find(_messageId, callback)
  } else {
    db.Message.findById(_messageId, callback)
  }
}