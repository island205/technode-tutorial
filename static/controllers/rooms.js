angular.module('techNodeApp')
  .controller('RoomsCtrl', function($scope, $location, socket) {
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
    $scope.enterRoom = function (room) {
      socket.emit('enter:room', {
        user: $scope.userMe,
        room: room
      })
      $scope.$emit('change:selectedRoom', room)
      $location.path('/rooms/' + room._id)
    }
  })