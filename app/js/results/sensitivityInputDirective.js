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
        'type': '='
      },
      templateUrl: 'app/js/results/sensitivityInputDirective.html',
      link: function(scope) {
        function refreshSlider() {
          $timeout(function() {
            scope.$broadcast('rzSliderForceRender');
          });
        }
        scope.keyCheck = keyCheck;
        refreshSlider();
        scope.slider = {
          value: scope.observedScales[scope.criterion.id][scope.alternative.id]['50%'],
          options: {
            floor: scope.criterion.pvf.range[0],
            ceil: scope.criterion.pvf.range[1],
            step: 1
          }
        };

        scope.$on('dropdown.hasClosed', function() {
          $timeout(function() {
            // scope.inputData = scope.inputState;
            // scope.inputData.label = ManualInputService.inputToString(scope.inputData);
            // scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
            scope.changeCallback();
          });
        });

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            scope.$broadcast('dropdown.closeEvent');
          } else if (event.keyCode === ENTER) {
            $timeout(function() {
              // scope.inputData = scope.inputState;
              // scope.inputData.label = ManualInputService.inputToString(scope.inputData);
              // scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
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