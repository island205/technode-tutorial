angular.module('techNodeApp', ['ngRoute', 'angularMoment'])
  .run(['$window', '$rootScope', '$location', 'server', function($window, $rootScope, $location, server) {
    $window.moment.lang('zh-cn')

    $rootScope.me = server.getUser()

    server.validate().then(function() {
      if ($location.path() === '/login') {
        $location.path('/rooms')
      }
    }, function() {
      $location.path('/login')
    })

    $rootScope.logout = function() {
      server.logout().then(function () {
        $location.path('/login')
      })
    }
  }])