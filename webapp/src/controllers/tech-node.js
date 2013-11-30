angular.module('techNodeApp').controller('TechNodeCtrl', function($scope, $location, $cookies, socket) {
  $scope.sendMessage = function() {
    socket.emit('add:message', {
      content: $scope.message,
      creator: $scope.userMe,
      _roomId: $scope.selectedRoom._id
    })
    $scope.message = ""
  }
  $scope.changeSelectedRoom = function(room) {
    socket.emit('change:room', {
      from: $scope.selectedRoom,
      to: room,
      user: $scope.userMe
    })
    $scope.$emit('change:selectedRoom', room)
  }
})