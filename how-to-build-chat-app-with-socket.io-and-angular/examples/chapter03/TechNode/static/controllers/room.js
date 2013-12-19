angular.module('techNodeApp').controller('RoomCtrl', function($scope, $routeParams, socket) {
  socket.on('rooms.read.' + $routeParams._roomId, function (room) {
    $scope.room = room
  })
  socket.emit('rooms.read', {
    _roomId: $routeParams._roomId
  })
  socket.on('messages.add', function (message) {
    $scope.room.messages.push(message)
  })
  socket.on('users.remove', function (user) {
    _userId = user._id
    $scope.technode.users = $scope.technode.users.filter(function (user) {
      return user._id != _userId
    })
  })
  // socket.on('technode.read', function (technode) {
  //   $scope.technode = technode
  // })
  // socket.on('messages.add', function (message) {
  //   $scope.technode.messages.push(message)
  // })
  // socket.emit('technode.read')
  // socket.on('users.add', function (user) {
  //   $scope.technode.users.push(user)
  // })
  // socket.on('users.remove', function (user) {
  //   _userId = user._id
  //   $scope.technode.users = $scope.technode.users.filter(function (user) {
  //     return user._id != _userId
  //   })
  // })
})