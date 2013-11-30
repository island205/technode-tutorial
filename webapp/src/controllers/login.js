angular.module('techNodeApp').controller('LoginCtrl', function($scope, $cookies, socket) {
  $scope.onSelectRoom = function(room) {
    $scope.selectedRoom = room
    $scope.$emit('change:selectedRoom', room)
  }
  $scope.login = function() {
    socket.emit('login', {
      email: $scope.email,
      selectedRoom: $scope.selectedRoom
    })
  }
})