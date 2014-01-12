angular.module('techNodeApp', ['ngRoute', 'angularMoment'])
  .run(function ($window, $http, $rootScope, $location) {
    $window.moment.lang('zh-cn')
    $http({
      url: '/ajax/validate',
      method: 'GET'
    }).success(function (user) {
      $rootScope.me = user
      if ($location.path() == '/login') {
        $location.path('/rooms')
      }
    }).error(function (data) {
      $location.path('/login')
    })
    $rootScope.logout = function() {
      $http({
        url: '/ajax/logout',
        method: 'GET'
      }).success(function () {
        delete $rootScope.me
        $location.path('/login')
      })
    }
    $rootScope.$on('login', function (evt, me) {
      $rootScope.me = me
    })
  })