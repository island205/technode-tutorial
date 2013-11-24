var nodechatApp = angular.module('nodechatApp', ['ngRoute', 'ngCookies'])

nodechatApp.directive('autoScrollToBottom', function() {
  return {
    link: function (scope, element, attrs) {
      scope.$watch(
        function() {
          return element.children().length;
        },
        function() {
          element.animate({
            scrollTop: element.prop('scrollHeight')
          }, 1000);
        }
      );
    }
  };
});
nodechatApp.directive('emojify', function() {
  return {
    link: function (scope, element, attrs) {
      scope.$watch(
        function() {
          return element.html()
        },
        function() {
          emojify.run(element.get(0))
        }
      );
    }
  };
});
nodechatApp.directive('markdown', function() {
  var converter = new Showdown.converter();
  return {
    link: function (scope, element, attrs) {
      scope.$watch(
        function() {
          return element.html()
        },
        function() {
          element.html(converter.makeHtml(element.html()))
        }
      );
    }
  };
});
nodechatApp.factory('socket', function($rootScope) {
  var socket = io.connect('/')
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments
        $rootScope.$apply(function() {
          callback.apply(socket, args)
        })
      })
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args)
          }
        })
      })
    }
  }
})

nodechatApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/login', {
    templateUrl: '/src/partials/login.html',
    controller: 'LoginCtrl'
  }).
  when('/', {
    templateUrl: '/src/partials/nodechat.html',
    controller: 'NodeChatCtrl'
  }).
  otherwise({
    redirectTo: '/'
  })
})

nodechatApp.controller('MainCtrl', function($scope, $location, $cookies, $cookieStore, socket) {
  socket.on('read:rooms', function(rooms) {
    $scope.rooms = rooms
    $scope.selectedRoom = rooms[0]
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
      $location.path('/')
    } else {
      $location.path('/login')
    }
  })
  socket.on('login', function(user) {
    $scope.userMe = user
    $location.path('/')
    $cookies.email = user.email
    $cookies.selectedRoomId = $scope.selectedRoom._id
  })
  $scope.logout = function () {
    $cookieStore.remove('email')
    $cookieStore.remove('selectedRoomId')
    window.location.reload()
  }
  $scope.$on('change:selectedRoom', function(evt, room) {
    $scope.selectedRoom = room
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
  socket.on('change:room', function (change) {
    $scope.rooms.forEach(function (room) {
      if (room._id == change.from._id) {
        room.users = room.users.filter(function (user) {
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
nodechatApp.controller('LoginCtrl', function($scope, $cookies, socket) {
  $scope.onSelectRoom = function(room) {
    $scope.selectedRoom = room
    $scope.$emit('change:selectedRoom', room)
  }
  $scope.login = function() {
    socket.emit('login', {
      email: $scope.email,
      selectedRoom: $scope.selectedRoom
    })
  }
})
nodechatApp.controller('NodeChatCtrl', function($scope, $location, $cookies, socket) {
  $scope.sendMessage = function() {
    socket.emit('add:message', {
      content: $scope.message,
      creator: $scope.userMe,
      _roomId: $scope.selectedRoom._id
    })
    $scope.message = ""
  }
  $scope.changeSelectedRoom = function (room) {
    socket.emit('change:room', {
      from: $scope.selectedRoom,
      to: room,
      user: $scope.userMe
    })
    $scope.$emit('change:selectedRoom', room)
  }
})
nodechatApp.controller('RoomCreatorCtrl', function($scope, socket) {
  $scope.isShow = false
  $scope.toggleCreator = function () {
    $scope.isShow = !$scope.isShow
  }
  $scope.createRoom = function () {
    socket.emit('create:room', {
      roomName: $scope.roomName
    })
  }
  socket.on('add:room', function (room) {
    $scope.rooms.push(room)
    $scope.isShow = false
  })
})