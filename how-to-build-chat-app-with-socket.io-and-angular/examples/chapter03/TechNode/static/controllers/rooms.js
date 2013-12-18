angular.module('techNodeApp').controller('RoomsCtrl', function($scope, socket) {
  $scope.searchRoom = function () {
    if ($scope.searchKey) {
      $scope.rooms = $scope._rooms.filter(function (room) {
        return room.name.indexOf($scope.searchKey) > -1
      })
    } else {
      $scope.rooms = $scope._rooms
    }

  }
  $scope.createRoom = function () {
    socket.emit('rooms.create', {
      name: $scope.searchKey
    })
  }
  socket.on('rooms.read', function (rooms) {
    $scope.rooms = $scope._rooms = rooms
  })
  socket.on('rooms.add', function (room) {
    $scope._rooms.push(room)
    $scope.searchRoom()
  })
  socket.emit('rooms.read')
})