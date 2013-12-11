angular.module('techNodeApp')
  .controller('RoomsCtrl', function($scope) {
    $scope.searchRoom = function() {
      var searchKey = $scope.searchKey
      if (!searchKey) {
        $scope.filteredRooms = $scope.rooms
      } else {
        $scope.filteredRooms = $scope.rooms.filter(function(room) {
          return room.name.indexOf($scope.searchKey) > -1
        })
      }

    }
  })