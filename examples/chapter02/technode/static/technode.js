angular.module('techNodeApp', ['ngRoute', 'angularMoment']).
run(function ($window, $rootScope, $http, $location) {
  $window.moment.lang('zh-cn')
  $http({
    url: '/ajax/validate',
    method: 'GET'
  }).success(function (user) {
    $rootScope.me = user
    $location.path('/')
  }).error(function (data) {
    $location.path('/login')
  })
  $rootScope.logout = function() {
    $http({
      url: '/ajax/logout',
      method: 'GET'
    }).success(function () {
      $rootScope.me = null
      $location.path('/login')
    })
  }
  $rootScope.$on('login', function (evt, me) {
    $rootScope.me = me
  })
})