angular.module('techNodeApp').factory('cache', function($cacheFactory) {
  var cache = $cacheFactory('technode')
  return cache
})