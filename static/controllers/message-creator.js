angular.module('techNodeApp').controller('MessageCreatorCtrl', function($scope, server) {
  $scope.createMessage = function() {

    server.createMessage({
      content: $scope.newMessage,
      creator: $scope.me,
      _roomId: $scope.room._id
    })

    $scope.newMessage = ''

  }
})