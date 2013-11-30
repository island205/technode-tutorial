angular.module('techNodeApp').controller('RoomCreatorCtrl', function($scope, socket) {
  $scope.isShow = false
  $scope.toggleCreator = function() {
    $scope.isShow = !$scope.isShow
  }
  $scope.createRoom = function() {
    socket.emit('create:room', {
      roomName: $scope.roomName
    })
  }
  socket.on('add:room', function(room) {
    $scope.rooms.push(room)
    $scope.isShow = false
  })
})