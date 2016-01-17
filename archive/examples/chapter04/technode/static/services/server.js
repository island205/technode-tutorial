angular.module('techNodeApp').factory('server', ['$cacheFactory', '$q', '$http', 'socket', function($cacheFactory, $q, $http, socket) {
  var cache = window.cache = $cacheFactory('technode')
  socket.on('technode', function(data) {
    switch (data.action) {
      case 'getRoom':
        if (data._roomId) {
          angular.extend(cache.get(data._roomId), data.data)
        } else {
          data.data.forEach(function (room) {
            cache.get('rooms').push(room)
          })
        }
        break
      case 'leaveRoom':
        var leave = data.data
        var _userId = leave.user._id
        var _roomId = leave.room._id
        cache.get(_roomId).users = cache.get(_roomId).users.filter(function(user) {
          return user._id != _userId
        })
        cache.get('rooms') && cache.get('rooms').forEach(function(room) {
          if (room._id === _roomId) {
            room.users = room.users.filter(function(user) {
              return user._id !== _userId
            })
          }
        })
        break
      case 'createRoom':
        cache.get('rooms').push(data.data)
        break
      case 'joinRoom':
        var join = data.data
        var _userId = join.user._id
        var _roomId = join.user._roomId
        if (!cache.get(_roomId)) {
          cache.get('rooms').forEach(function (room) {
            if (room._id === _roomId) {
              cache.put(_roomId, room)
            }
          })
        }
        cache.get(_roomId).users.push(join.user)
        break
      case 'createMessage':
        var message = data.data
        cache.get(message._roomId).messages.push(message)
        break
    }
  })
  socket.on('err', function (data) {
    console.log(data)
  })
  return {
    validate: function() {
      var deferred = $q.defer()
      $http({
        url: '/api/validate',
        method: 'GET'
      }).success(function(user) {
        angular.extend(this.getUser(), user)
        deferred.resolve()
      }.bind(this)).error(function(data) {
        deferred.reject()
      })
      return deferred.promise
    },
    login: function(email) {
      var deferred = $q.defer()
      $http({
        url: '/api/login',
        method: 'POST',
        data: {
          email: email
        }
      }).success(function(user) {
        angular.extend(cache.get('user'), user)
        deferred.resolve()
      }).error(function() {
        deferred.reject()
      })
      return deferred.promise
    },
    logout: function() {
      var deferred = $q.defer()
      $http({
        url: '/api/logout',
        method: 'GET'
      }).success(function() {
        var user = cache.get('user')
        for (key in user) {
          if (user.hasOwnProperty(key)) {
            delete user[key]
          }
        }
        deferred.resolve()
      })
      return deferred.promise
    },
    getUser: function() {
      if (!cache.get('user')) {
        cache.put('user', {})
      }
      return cache.get('user')
    },
    getRoom: function(_roomId) {
      if (!cache.get(_roomId)) {
        cache.put(_roomId, {
          users: [],
          messages: []
        })
        socket.emit('technode', {
          action: 'getRoom',
          data: {
            _roomId: _roomId
          }
        })
      }
      return cache.get(_roomId)
    },
    getRooms: function() {
      if (!cache.get('rooms')) {
        cache.put('rooms', [])
        socket.emit('technode', {
          action: 'getRoom'
        })
      }
      return cache.get('rooms')
    },
    joinRoom: function(join) {
      socket.emit('technode', {
        action: 'joinRoom',
        data: join
      })
    },
    leaveRoom: function(leave) {
      socket.emit('technode', {
        action: 'leaveRoom',
        data: leave
      })
    },
    createRoom: function(room) {
      socket.emit('technode', {
        action: 'createRoom',
        data: room
      })
    },
    createMessage: function(message) {
      socket.emit('technode', {
        action: 'createMessage',
        data: message
      })
    }
  }
}])