angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
  $scope.createMessage = function () {
    socket.emit('messages.create', $scope.newMessage)
    $scope.newMessage = ''
  }
})