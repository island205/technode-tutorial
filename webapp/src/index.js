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

nodechatApp.controller('MainCtrl', function ($scope, socket) {
  $scope.onSelectRoom = function (room) {
    $scope.selectedRoom = room
  }
  socket.on('read:rooms', function (rooms) {
    $scope.rooms = rooms
    $scope.selectedRoom = rooms[0]
  })
  socket.emit('read:rooms')
})
nodechatApp.controller('LoginCtrl', function ($scope, $location, socket) {
  $scope.login = function () {
    $location.path('/')
  }
})
nodechatApp.controller('NodeChatCtrl', function ($scope) {
})
