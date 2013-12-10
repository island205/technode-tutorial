angular.module('techNodeApp').controller('LoginCtrl', function($scope, $cookies, socket) {
  $scope.login = function() {
    socket.emit('login', {
      email: $scope.email
    })
  }
})