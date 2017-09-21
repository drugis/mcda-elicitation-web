'use strict';
define(['lodash'], function(_) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = ['$timeout', 'mcdaRootPath'];

  var SensitivityInputDirective = function($timeout, mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'alternative': '=',
        'originalValue': '=',
        'currentValue': '=',
        'changeCallback': '='
      },
      templateUrl: mcdaRootPath + 'js/results/sensitivityInputDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.checkInput = checkInput;
        scope.showSlider = showSlider;

        // init
        scope.newValue = scope.currentValue;
        scope.$on('dropdown.hasClosed', function() {
          $timeout(function() {
            closeAndSave();
          });
        });
        scope.$watch('currentValue', function() {
          scope.newValue = scope.currentValue; //needed for reset button
        });

        function showSlider() {
          scope.slider = initSlider();
          $timeout(function() {
            scope.$broadcast('rzSliderForceRender');
            scope.$broadcast('reCalcViewDimensions');
          });
        }

        function initSlider() {
          return {
            value: scope.currentValue,
            options: {
              floor: scope.criterion.pvf.range[0],
              ceil: scope.criterion.pvf.range[1],
              step: 0.0001,
              precision: 10
            }
          };
        }

        function checkInput() {
          if (scope.slider.value > scope.slider.options.ceil) {
            scope.slider.value = scope.slider.options.ceil;
          } else if (scope.slider.value < scope.slider.options.floor) {
            scope.slider.value = scope.slider.options.floor;
          }
        }

        function closeAndSave() {
          if (!isNaN(scope.slider.value)) {
            scope.newValue = scope.slider.value;
            scope.changeCallback(scope.newValue, scope.criterion, scope.alternative);
          }
          scope.$broadcast('dropdown.closeEvent');
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            scope.$broadcast('dropdown.closeEvent');
          } else if (event.keyCode === ENTER) {
            $timeout(function() {
              closeAndSave();
            });
          }
        }
      }
    };
  };
  return dependencies.concat(SensitivityInputDirective);
});