angular.module('techNodeApp').controller('RoomsCtrl', function($scope, $location, socket) {
  $scope.searchRoom = function () {
    if ($scope.searchKey) {
      $scope.filteredRooms = $scope.rooms.filter(function (room) {
        return room.name.indexOf($scope.searchKey) > -1
      })
    } else {
      $scope.filteredRooms = $scope.rooms
    }

  }
  $scope.createRoom = function () {
    socket.emit('rooms.create', {
      name: $scope.searchKey
    })
  }
  socket.on('users.join.' + $scope.me._id, function (join) {
    $location.path('/rooms/' + join.room._id)
  })
  $scope.enterRoom = function (room) {
    socket.emit('users.join', {
      user: $scope.me,
      room: room
    })
  }
  socket.on('rooms.read', function (rooms) {
    $scope.filteredRooms = $scope.rooms = rooms
  })
  socket.on('rooms.add', function (room) {
    $scope.rooms.push(room)
    $scope.searchRoom()
  })
  socket.emit('rooms.read')
})