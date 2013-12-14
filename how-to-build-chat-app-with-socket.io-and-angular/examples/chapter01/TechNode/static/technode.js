angular.module('techNodeApp', [])

angular.module('techNodeApp').factory('socket', function($rootScope) {
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

angular.module('techNodeApp').directive('ctrlEnterBreakLine', function() {
  return function(scope, element, attrs) {
    var ctrlDown = false
    element.bind("keydown", function(evt) {
      if (evt.which === 17) {
        ctrlDown = true
        setTimeout(function() {
          ctrlDown = false
        }, 1000)
      }
      if (evt.which === 13) {
        if (ctrlDown) {
          element.val(element.val() + '\n')
        } else {
          scope.$apply(function() {
            scope.$eval(attrs.ctrlEnterBreakLine);
          });
          evt.preventDefault()
        }
      }
    });
  };
});

angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
  $scope.createMessage = function () {
    socket.emit('messages.create', $scope.newMessage)
    $scope.newMessage = ''
  }
})

angular.module('techNodeApp').directive('autoScrollToBottom', function() {
  return {
    link: function(scope, element, attrs) {
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

angular.module('techNodeApp').controller('RoomCtrl', function($scope, socket) {
  $scope.messages = []
  socket.on('messages.read', function (messages) {
    $scope.messages = messages
  })
  socket.on('messages.add', function (message) {
    $scope.messages.push(message)
  })
  socket.emit('messages.read')
})