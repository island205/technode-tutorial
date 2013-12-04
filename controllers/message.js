var db = require('../models')
var async = require('async')
var gravatar = require('gravatar')

exports.create = function(message, callback) {
  var m = new db.Message()
  m.content = message.content
  m.creator = message.creator
  m._roomId = message._roomId
  m.save(callback)
}