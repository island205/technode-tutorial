angular.module('techNodeApp').controller('RoomCtrl', function($scope, socket) {
  socket.on('technode.read', function (technode) {
    $scope.technode = technode
  })
  socket.on('messages.add', function (message) {
    $scope.technode.messages.push(message)
  })
  socket.emit('technode.read')
  socket.on('users.add', function (user) {
    $scope.technode.users.push(user)
  })
  socket.on('users.remove', function (user) {
    _userId = user._id
    $scope.technode.users = $scope.technode.users.filter(function (user) {
      return user._id != _userId
    })
  })
})