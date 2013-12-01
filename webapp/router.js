angular.module('techNodeApp').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/login', {
    templateUrl: '/partials/login.html',
    controller: 'LoginCtrl'
  }).
  when('/', {
    templateUrl: '/partials/technode.html',
    controller: 'TechNodeCtrl'
  }).
  otherwise({
    redirectTo: '/'
  })
})
