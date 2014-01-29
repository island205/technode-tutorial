angular.module('techNodeApp', ['ngRoute', 'angularMoment'])
  .run(['$window', '$rootScope', '$location', 'server', function($window, $rootScope, $location, server) {
    $window.moment.lang('zh-cn')

    server.validate().then(function() {
      if ($location.path() === '/login') {
        $location.path('/rooms')
      }
    }, function() {
      $location.path('/login')
    })

    $rootScope.me = server.getUser()

    $rootScope.logout = function() {
      server.logout().then(function () {
        $location.path('/login')
      })
    }
  }])