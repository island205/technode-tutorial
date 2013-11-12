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

nodechatApp.config(['$routeProvider'], function ($routeProvider) {
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

nodechatApp.controller('LoginCtrl', function ($scope, socket) {
  socket.on('read:rooms', function (rooms) {
    $scope.rooms = rooms
  })
})
