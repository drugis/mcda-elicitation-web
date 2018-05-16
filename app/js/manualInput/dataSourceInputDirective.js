'use strict';
define(['lodash'], function(_) {
  var dependencies = [];

  var DataSourceInputDirective = function() {
    return {
      restrict: 'E',
      scope: {
        dataSource: '='
      },
      templateUrl: 'js/manualInput/dataSourceInputDirective.html',
      link: function(scope) {
        scope.dataTypeChanged = dataTypeChanged;
        scope.inputTypeChanged = inputTypeChanged;
        scope.checkSourceLink = checkSourceLink;

        function dataTypeChanged() {
          switch (scope.dataSource.dataType) {
            case 'dichotomous':
              scope.dataSource.parameterOfInterest = 'eventProbability';
              break;
            case 'continuous':
              scope.dataSource.parameterOfInterest = 'mean';
              break;
            default:
              scope.dataSource.parameterOfInterest = 'value';
          }
        }

        function inputTypeChanged() {
          if (scope.dataSource.inputType === 'distribution' && scope.dataSource.dataType === 'other') {
            scope.dataSource.dataType = 'dichotomous';
          }
        }

        function checkSourceLink() {
          var regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
          if (scope.dataSource.sourceLink && !scope.dataSource.sourceLink.match(regex)) {
            scope.errors.push('Invalid URL');
          }
        }
      }
    };
  };
  return dependencies.concat(DataSourceInputDirective);
});
