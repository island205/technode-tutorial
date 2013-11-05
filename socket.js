var db = require('./models')
var async = require('async')
module.exports = function (socket) {
  socket.on('read:rooms', function () {
    db.Room.find({}, function (err, rooms) {
      if (!err) {
        async.each(rooms, function (room, done) {
          db.User.find({}, function (err, users) {
            if (err) {
              done(err)
            } else {
              room.users = users
              room._name = room.name
              done()
            }
          })
        }, function (err) {
          if (!err) {
            socket.emit('read:rooms', rooms)
          }
        })
      }
    })
  })
}