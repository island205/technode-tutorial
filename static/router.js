angular.module('techNodeApp').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/rooms', {
    templateUrl: '/partials/rooms.html',
    controller: 'RoomsCtrl'
  }).
  when('/login', {
    templateUrl: '/partials/login.html',
    controller: 'LoginCtrl'
  }).
  when('/rooms/:id', {
    templateUrl: '/partials/room.html',
    controller: 'RoomCtrl'
  }).
  otherwise({
    redirectTo: '/'
  })
})
