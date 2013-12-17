var db = require('../models')
var async = require('async')

exports.create = function(room, callback) {
  var r = new db.Room()
  r.name = room.name
  r.save(callback)
}

exports.read = function(callback) {
  db.Room.find({}, function(err, rooms) {
    if (!err) {
      var roomsData = []
      async.each(rooms, function(room, done) {
        var roomData = room.toObject()
        db.User.find({
          _roomId: roomData._id,
          online: true
        }, function(err, users) {
          if (err) {
            done(err)
          } else {
            roomData.users = users
            roomsData.push(roomData)
            done()
          }
        })
      }, function(err) {
        callback(err, roomsData)
      })
    }
  })
}