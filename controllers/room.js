var db = require('../models')
var async = require('async')
var gravatar = require('gravatar')

exports.create = function(room, callback) {
  var r = new db.Room()
  r.name = room.roomName
  r.save(callback)
}

exports.read = function(callback) {
  db.Room.find({}, function(err, rooms) {
    if (!err) {
      var roomsData = []
      async.each(rooms, function(room, done) {
        var roomData = room.toObject()
        async.parallel([

            function(done) {
              db.User.find({
                _roomId: roomData._id,
                online: true
              }, function(err, users) {
                done(err, users)
              })
            },
            function(done) {
              db.Message.find({
                _roomId: roomData._id
              }, null, {
                sort: {
                  'create_at': -1
                },
                limit: 20
              }, function(err, messages) {
                done(err, messages.reverse())
              })
            }
          ],
          function(err, results) {
            if (err) {
              done(err)
            } else {
              roomData.users = results[0]
              roomData.messages = results[1]
              roomsData.push(roomData)
              done()
            }
          });

      }, function(err) {
        callback(err, roomsData)
      })
    }
  })
}