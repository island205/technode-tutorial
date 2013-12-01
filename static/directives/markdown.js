angular.module('techNodeApp').directive('markdown', function() {
  var converter = new Showdown.converter();
  return {
    link: function(scope, element, attrs) {
      scope.$watch(
        function() {
          return element.html()
        },
        function() {
          element.html(converter.makeHtml(element.html()))
        }
      );
    }
  };
});