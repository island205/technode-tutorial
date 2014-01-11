angular.module('techNodeApp', ['ngRoute', 'angularMoment'])
  .run(function ($window, $http, $rootScope, $location, data) {
    $window.moment.lang('zh-cn')
    var promise = data.get('users', '52ae448ad9964a186c000001')
    promise.then(function (user) {
      $rootScope.me = user
      $location.path('/rooms')
    })
    // $http({
    //   url: '/ajax/validate',
    //   method: 'GET'
    // }).success(function (user) {
    //   $rootScope.me = user
    //   if ($location.path() == '/login') {
    //     $location.path('/rooms')
    //   }
    // }).error(function (data) {
    //   $location.path('/login')
    // })
    // $rootScope.logout = function() {
    //   $http({
    //     url: '/ajax/logout',
    //     method: 'GET'
    //   }).success(function () {
    //     delete $rootScope.me
    //     $location.path('/login')
    //   })
    // }
    // $rootScope.$on('login', function (evt, me) {
    //   $rootScope.me = me
    // })
  })