var nodechatApp = angular.module('nodechatApp', [])

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

nodechatApp.controller("RoomListCtrl", function RoomListCtrl($scope, socket) {
  socket.on('read:rooms', function(rooms) {
    $scope.rooms = rooms
  })
  socket.emit('read:rooms')
})
nodechatApp.controller("LoginCtrl", function LoginCtrl($scope, socket) {
  socket.on('read:rooms', function(rooms) {
    $scope.rooms = rooms
    $scope.selectRoom = {
      item: $scope.rooms[0]
    }
    $('.log-in-modal').modal()
  })
  socket.emit('read:rooms')
  $scope.login = function () {
    alert('login')
  }
})