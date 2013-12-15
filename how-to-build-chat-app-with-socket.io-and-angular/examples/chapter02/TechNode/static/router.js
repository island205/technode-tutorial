angular.module('techNodeApp').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/', {
    templateUrl: '/pages/room.html',
    controller: 'RoomCtrl'
  }).
  when('/login', {
    templateUrl: '/pages/login.html',
    controller: 'LoginCtrl'
  }).
  otherwise({
    redirectTo: '/login'
  })
})
