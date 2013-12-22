var db = require('../models')

exports.create = function(message, callback) {
  var message = new db.Message(message)
  message.save(callback)
}