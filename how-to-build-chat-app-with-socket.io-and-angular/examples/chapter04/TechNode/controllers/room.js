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

exports.getById = function(_roomId, callback) {
  db.Room.findOne({
    _id: _roomId
  }, function(err, room) {
    if (err) {
      callback(err)
    } else {
      async.parallel([

          function(done) {
            db.User.find({
              _roomId: _roomId,
              online: true
            }, function(err, users) {
              done(err, users)
            })
          },
          function(done) {
            db.Message.find({
              _roomId: _roomId
            }, null, {
              sort: {
                'createAt': -1
              },
              limit: 20
            }, function(err, messages) {
              done(err, messages.reverse())
            })
          }
        ],
        function(err, results) {
          if (err) {
            callback(err)
          } else {
            room = room.toObject()
            room.users = results[0]
            room.messages = results[1]
            callback(null, room)
          }
        });
    }
  })
}