angular.module('techNodeApp').controller('MainCtrl', function($scope, $http, $location) {
  $http({
    url: '/ajax/validate',
    method: 'GET'
  }).success(function (user) {
    $scope.me = user
    $location.path('/')
  }).error(function (data) {
    $location.path('/login')
  })
  $scope.logout = function() {
    $http({
      url: '/ajax/logout',
      method: 'GET'
    }).success(function () {
      $scope.me = null
      $location.path('/login')
    })
  }
  $scope.$on('login', function (evt, me) {
    $scope.me = me
  })
})