'use strict';
define(['lodash'], function(_) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = ['ManualInputService', '$timeout'];

  var SensitivityInputDirective = function(ManualInputService, $timeout) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'alternative': '=',
        'observedScales': '=',
        'changeCallback': '=',
        'type':'='
      },
      templateUrl: 'app/js/results/sensitivityInputDirective.html',
      link: function(scope) {
        scope.keyCheck = keyCheck;
        scope.render = ManualInputService.inputToString;
        scope.cacheInput = cacheInput;

        scope.$on('dropdown.hasClosed', function() {
          $timeout(function() {
            scope.inputData = scope.inputState;
            scope.inputData.label = ManualInputService.inputToString(scope.inputData);
            scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
            scope.changeCallback();
          });
        });

        function cacheInput() {
          scope.inputState = _.cloneDeep(scope.inputData);
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            scope.$broadcast('dropdown.closeEvent');
          } else if (event.keyCode === ENTER) {
            $timeout(function() {
              scope.inputData = scope.inputState;
              scope.inputData.label = ManualInputService.inputToString(scope.inputData);
              scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
              scope.changeCallback();
              scope.$broadcast('dropdown.closeEvent');
            });
          }
        }
      }
    };
  };
  return dependencies.concat(SensitivityInputDirective);
});