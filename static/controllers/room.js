angular.module('techNodeApp').controller('RoomCtrl', function($scope, $location, $cookies, $routeParams, socket) {
  $scope.sendMessage = function() {
    socket.emit('add:message', {
      content: $scope.message,
      creator: $scope.userMe,
      _roomId: $scope.selectedRoom._id
    })
    $scope.message = ""
  }
})