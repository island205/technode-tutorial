var db = require('./models')
var async = require('async')
module.exports = function (socket) {
  socket.on('read:rooms', function () {
    db.Room.find({}, function (err, rooms) {
      if (!err) {
        var roomsData = []
        async.each(rooms, function (room, done) {
          var roomData = room.toObject()
          async.parallel([
            function (done) {
              db.User.find({_roomId: roomData._id}, function (err, users) {
                  done(err, users)
              })
            },
            function (done) {
              db.Message.find({_roomId: roomData._id}, function (err, messages) {
                done(err, messages)
              })
            }
          ],
          function (err, results) {
            if (err) {
              done(err)
            } else {
              roomData.users = results[0]
              roomData.messsages = results[1]
              roomsData.push(roomData)
              done()
            }
          });

        }, function (err) {
          if (!err) {
            socket.emit('read:rooms', roomsData)
          }
        })
      }
    })
  })
}