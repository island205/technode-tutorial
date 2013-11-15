var nodechatApp = angular.module('nodechatApp', ['ngRoute'])

nodechatApp.factory('socket', function($rootScope) {
  var socket = io.connect('http://localhost:3000')
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

nodechatApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
    when('/login', {
      templateUrl:'/src/partials/login.html',
      controller: 'LoginCtrl'
    }).
    when('/', {
      templateUrl: '/src/partials/nodechat.html',
      controller: 'NodeChatCtrl'
    }).
    otherwise({
      redirectTo:'/login'
    })
})

nodechatApp.controller('MainCtrl', function ($scope, $location, socket) {
  socket.on('read:rooms', function (rooms) {
    $scope.rooms = rooms
    $scope.selectedRoom = rooms[0]
  })
	socket.on('login', function (user) {
		$scope.userMe = user
		$location.path('/')
	})
	socket.on('add:user', function (user) {
		$scope.rooms.forEach(function (room) {
			if (room.id == user._roomId) {
				room.push(user)
			}
		})
	})
  socket.emit('read:rooms')
})
nodechatApp.controller('LoginCtrl', function ($scope, socket) {
  $scope.onSelectRoom = function (room) {
    $scope.selectedRoom = room
  }
  $scope.login = function () {
		socket.emit('login', {
			email:$scope.email,
			selectedRoom:$scope.selectedRoom
		})
  }
})
nodechatApp.controller('NodeChatCtrl', function ($scope) {
})
