angular.module('techNodeApp').controller('RoomCtrl', function($scope, $routeParams, $scope, server) {

  $scope.room = server.getRoom($routeParams._roomId)

	server.joinRoom({
	  user: $scope.me,
	  room: {
	  	_id: $routeParams._roomId
	  }
	})

  $scope.$on('$routeChangeStart', function() {
    server.leaveRoom({
      user: $scope.me,
      room: $scope.room
    })
  })
})