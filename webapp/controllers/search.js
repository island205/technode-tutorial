angular.module('techNodeApp').controller('SearchCtrl', function($scope) {
  $scope.filterRoom = function() {
    $scope.rooms.forEach(function(room) {
      if (room.name.indexOf($scope.key) === -1) {
        room.hide = true
      } else {
        room.hide = false
      }
    })
  }
})