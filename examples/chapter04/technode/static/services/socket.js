angular.module('techNodeApp').factory('socket', ['$rootScope', function($rootScope) {
  // var socket = io.connect('/')
  //为了避免跨域请求，需要将原来的var socket = io.connect('/')改成下面这一行
  // var socket = io.connect('http://localhost:3000/')
  //或者采用socket官方主页上面的方法 var socket = io()
  var socket = io();
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
}])