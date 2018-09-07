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
        scope.dataTypeChanged = dataTypeChanged;
        scope.inputTypeChanged = inputTypeChanged;
        scope.checkSourceLink = checkSourceLink;

        function dataTypeChanged() {
          switch (scope.source.dataType) {
            case 'dichotomous':
              scope.source.parameterOfInterest = 'eventProbability';
              break;
            case 'continuous':
              scope.source.parameterOfInterest = 'mean';
              break;
            default:
              scope.source.parameterOfInterest = 'value';
          }
        }

        function inputTypeChanged() {
          if (scope.source.inputType === 'distribution' && scope.source.dataType === 'other') {
            scope.source.dataType = 'dichotomous';
          }
        }

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
