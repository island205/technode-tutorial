angular.module('techNodeApp').directive('emojify', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(
        function() {
          return element.html()
        },
        function() {
          emojify.run(element.get(0))
        }
      );
    }
  };
});