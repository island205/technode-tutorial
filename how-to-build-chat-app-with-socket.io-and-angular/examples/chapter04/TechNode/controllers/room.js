var db = require('../models')
var _ = require('underscore')

exports.create = function(room, callback) {
  var room = new db.Room(room)
  room.save(callback)
}
exports.remove = function (_roomId, callback) {
  db.Room.findByIdAndRemove(_roomId, callback)
}
exports.update = function (_roomId, update, callback) {
  db.Room.findByIdAndUpdate(_roomId, update, callback)
}
exports.read = function (_roomId, callback) {
  if (_.isObject(_roomId)) {
    db.Room.find(_roomId, callback)
  } else {
    db.Room.findById(_roomId, callback)
  }
}