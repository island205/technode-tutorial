angular.module('techNodeApp').controller('RoomsCtrl', function($scope, $location, socket) {
  $scope.searchRoom = function() {
    if ($scope.searchKey) {
      $scope.filteredRooms = $scope.rooms.filter(function(room) {
        return room.name.indexOf($scope.searchKey) > -1
      })
    } else {
      $scope.filteredRooms = $scope.rooms
    }

  }
  $scope.createRoom = function() {
    server.createRoom({
      name: $scope.searchKey
    })
  }
  $scope.enterRoom = function(room) {
    server.joinRoom({
      user: $scope.me,
      room: room
    })
  }

  $scope.filteredRooms = $scope.rooms = server.getRooms()
})