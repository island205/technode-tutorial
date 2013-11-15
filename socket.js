var db = require('./models')
var async = require('async')
var gravatar = require('gravatar')
module.exports = function (socket, io) {
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
	socket.on('login', function (data) {
		function createUser () {
			var user = new db.User
			user.avatar = gravatar.url(data.email)
			user.name = data.email.split('@').shift()
			user.email = data.email
			user._roomId = data.selectedRoom._id
			user.save(function (err, user) {
				if (err) {
					socket.emit('server:err', err)
				} else {
					socket.emit('login', user)
					io.sockets.emit('add:user', user)
				}
			})
		}
		db.User.findOne({
			email: data.email
		}, function (err, user) {
			if (err) {
				socket.emit('server:err', err)
			} else if (user) {
				socket.emit('login', user)
			} else {
				createUser()
			}
		})
	})
}