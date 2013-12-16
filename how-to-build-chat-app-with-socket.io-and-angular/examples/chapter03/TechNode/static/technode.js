angular.module('techNodeApp', ['ngRoute', 'angularMoment']).
run(function ($window) {
  $window.moment.lang('zh-cn')
})