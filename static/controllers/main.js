angular.module('techNodeApp').controller('MainCtrl', function($scope, $location, $cookies, $cookieStore, socket) {
  socket.on('read:rooms', function(rooms) {
    $scope.rooms = rooms
    // 已经登录
    var selectedRoom = null
    if ($cookies.email) {
      rooms.forEach(function(room) {
        if (room._id == $cookies['selectedRoomId']) {
          selectedRoom = room
        }
      })
      socket.emit('login', {
        email: $cookies.email,
        selectedRoom: selectedRoom
      })
    // 否则登录
    } else {
      $location.path('/login')
    }
  })
  socket.on('login', function(user) {
    $scope.userMe = user
    $location.path('/')
    $cookies.email = user.email
    // 登录后，如果已经选择了房间，则直接进入房间
    if(!!user._roomId) {
      $cookies.selectedRoomId = $scope.selectedRoom._id = user._roomId
      $location.path('/rooms/' + user._roomId)
    // 否则，选择或者新建方面
    } else {
      $location.path('/rooms')
    }
  })
  $scope.logout = function() {
    $cookieStore.remove('email')
    $cookieStore.remove('selectedRoomId')
    window.location.reload()
  }
  $scope.$on('change:selectedRoom', function(evt, room) {
    $scope.selectedRoom = room
  })
  $scope.$on('change:rooms', function(evt, rooms) {
    $scope.rooms = rooms
  })
  socket.on('logout', function(user) {
    if (user._id == $scope.userMe._id) {
      return
    }
    $scope.rooms.forEach(function(room) {
      if (room._id == user._roomId) {
        room.users = room.users.filter(function(u) {
          return user._id != u._id
        })
      }
    })
  })
  socket.on('add:user', function(user) {
    $scope.rooms.forEach(function(room) {
      if (room._id == user._roomId) {
        if (room.users.map(function(user) {
          return user._id
        }).indexOf(user._id) == -1) {
          room.users.push(user)
        }
      }
    })
  })
  socket.on('add:message', function(message) {
    $scope.rooms.forEach(function(room) {
      if (room._id == message._roomId) {
        room.messages.push(message)
      }
    })
  })
  socket.on('change:room', function(change) {
    $scope.rooms.forEach(function(room) {
      if (room._id == change.from._id) {
        room.users = room.users.filter(function(user) {
          return user._id != change.user._id
        })
      }
      if (room._id == change.to._id) {
        room.users.push(change.user)
      }
    })
  })
  socket.emit('read:rooms')
})