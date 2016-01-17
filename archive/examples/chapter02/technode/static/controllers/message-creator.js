angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
  $scope.createMessage = function () {
    socket.emit('messages.create', {
      content: $scope.newMessage,
      creator: $scope.me
    })
    $scope.newMessage = ''
  }
})