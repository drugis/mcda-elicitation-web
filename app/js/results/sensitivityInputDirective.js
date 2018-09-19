'use strict';
define([], function() {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = ['$timeout'];

  var SensitivityInputDirective = function($timeout) {
    return {
      restrict: 'E',
      scope: {
        'row': '=',
        'alternative': '=',
        'originalValue': '=',
        'currentValue': '=',
        'changeCallback': '=',
        'isEditing': '='
      },
      templateUrl: './sensitivityInputDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.checkInput = checkInput;
        scope.showSlider = showSlider;

        // init
        var isEscPressed = false;
        scope.newValue = scope.currentValue;
        initSlider();

        scope.$on('open.af.dropdownToggle', function() {
          scope.isEditing(true);
          isEscPressed = false;
        });

        scope.$on('close.af.dropdownToggle', function() {
          scope.isEditing(false);
          if (!isEscPressed) {
            closeAndSave();
          }
        });

        scope.$watch('currentValue', function() {
          scope.newValue = scope.currentValue; //needed for reset button
        });

        function showSlider() {
          initSlider();
          $timeout(function() {
            scope.$broadcast('rzSliderForceRender');
            scope.$broadcast('reCalcViewDimensions');
          });
        }

        function initSlider() {
          scope.slider = {
            value: scope.currentValue,
            options: {
              floor: scope.row.dataSource.pvf.range[0],
              ceil: scope.row.dataSource.pvf.range[1],
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
          $timeout(function() {
            if (!isNaN(scope.slider.value)) {
              scope.newValue = scope.slider.value;
              scope.changeCallback(scope.newValue, scope.row, scope.alternative);
            }
          });
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            isEscPressed = true;
            scope.$broadcast('doClose.af.dropdownToggle');
          } else if (event.keyCode === ENTER) {
            scope.$broadcast('doClose.af.dropdownToggle');
          }
        }
      }
    };
  };
  return dependencies.concat(SensitivityInputDirective);
});
