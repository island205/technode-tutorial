angular.module('techNodeApp').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/login', {
    templateUrl: '/src/partials/login.html',
    controller: 'LoginCtrl'
  }).
  when('/', {
    templateUrl: '/src/partials/technode.html',
    controller: 'TechNodeCtrl'
  }).
  otherwise({
    redirectTo: '/'
  })
})