angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, socket) {
  $scope.createMessage = function() {

    $scope.newMessage = ''

    server.createMessage({
      content: $scope.newMessage,
      creator: $scope.me,
      _roomId: $scope.room._id
    })

  }
})