angular.module('techNodeApp').controller('LoginCtrl', ['$scope', '$location', 'server', function($scope, $location, server) {
  $scope.login = function () {
    server.login($scope.email).then(function () {
      $location.path('/rooms')
    }, function () {
      $location.path('/login')
    })
  }
}])