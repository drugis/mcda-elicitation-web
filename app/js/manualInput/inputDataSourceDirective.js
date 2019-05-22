'use strict';
define([], function() {
  var dependencies = [];

  var DataSourceInputDirective = function() {
    return {
      restrict: 'E',
      scope: {
        source: '=',
        isInvalidSourceLink: '=',
        changeCallback: '='
      },
      templateUrl: './inputDataSourceDirective.html',
      link: function(scope) {
        // functions
        scope.checkSourceLink = checkSourceLink;

        function checkSourceLink() {
          var regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
          scope.isInvalidSourceLink.isInvalid = scope.source.sourceLink && !scope.source.sourceLink.match(regex);
          scope.changeCallback();
        }
      }
    };
  };
  return dependencies.concat(DataSourceInputDirective);
});
