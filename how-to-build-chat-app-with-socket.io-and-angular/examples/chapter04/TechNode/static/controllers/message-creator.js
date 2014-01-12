angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
  $scope.createMessage = function() {
    socket.emit('technode', {
      action: 'createMessage',
      data: {
        content: $scope.newMessage,
        creator: $scope.me,
        _roomId: $scope.room._id
      }
    })
    $scope.newMessage = ''
  }
})