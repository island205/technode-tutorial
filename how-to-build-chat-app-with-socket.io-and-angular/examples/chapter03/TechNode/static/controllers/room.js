angular.module('techNodeApp').controller('RoomCtrl', function($scope, $routeParams, $scope, socket) {
  socket.on('rooms.read.' + $routeParams._roomId, function(room) {
    $scope.room = room
  })
  socket.emit('rooms.read', {
    _roomId: $routeParams._roomId
  })
  socket.on('messages.add', function(message) {
    $scope.room.messages.push(message)
  })

  $scope.$on('$routeChangeStart', function() {
    socket.emit('users.leave', {
      user: $scope.me,
      room: $scope.room
    })
  })
  socket.on('users.join', function (join) {
    $scope.room.users.push(join.user)
  })

  socket.on('users.leave', function(leave) {
    _userId = leave.user._id
    $scope.room.users = $scope.room.users.filter(function(user) {
      return user._id != _userId
    })
  })
})