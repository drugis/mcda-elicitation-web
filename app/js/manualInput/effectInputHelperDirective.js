'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = [
    'ManualInputService',
    '$timeout'
  ];

  var EffectInputHelperDirective = function(
    ManualInputService,
    $timeout
  ) {
    return {
      restrict: 'E',
      scope: {
        'alternative': '=',
        'cell': '=',
        'changeCallback': '=',
        'inputType': '=',
        'unitOfMeasurement': '='
      },
      templateUrl: 'js/manualInput/effectInputHelperDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.inputChanged = inputChanged;

        //init
        var isEscPressed = false;

        initInputParameters();

        scope.$on('open.af.dropdownToggle', function() {
          isEscPressed = false;
        });

        scope.$on('close.af.dropdownToggle', function() {
          if (!isEscPressed) {
            saveState();
          }
        });

        scope.$watch('cell', initInputParameters, true);

        function saveState() {
          $timeout(function() {
            scope.cell = angular.copy(scope.inputCell);
            scope.cell.isInvalid = ManualInputService.getInputError(scope.inputCell);
            scope.cell.label = ManualInputService.inputToString(scope.inputCell);
            $timeout(scope.changeCallback);
          });
        }

        function initInputParameters() {
          scope.inputParameterOptions = ManualInputService.getOptions(scope.inputType);
          scope.cell.inputParameters = getInputParameters();
          scope.cell.constraint = getCellConstraint();
          scope.inputCell = ManualInputService.updateParameterConstraints(scope.cell, scope.unitOfMeasurement);
          inputChanged();
          scope.cell.label = ManualInputService.inputToString(scope.inputCell);
          scope.cell.isInvalid = ManualInputService.getInputError(scope.inputCell);
          scope.changeCallback();
        }

        function getInputParameters() {
          if (!scope.cell.inputParameters) {
            return _.values(scope.inputParameterOptions)[0];
          } else {
            return scope.inputParameterOptions[scope.cell.inputParameters.id];
          }
        }

        function getCellConstraint() {
          if (scope.unitOfMeasurement.selectedOption.type !== 'custom' ) {
            return scope.unitOfMeasurement.selectedOption.type;
          } else {
            return 'None';
          }
        }

        function inputChanged() {
          if (scope.inputCell.inputParameters.id !== 'text' && isNotNumeric(scope.inputCell.firstParameter)) {
            delete scope.inputCell.firstParameter;
          }
          scope.error = ManualInputService.getInputError(scope.inputCell);
        }

        function isNotNumeric(value) {
          return isNaN(parseFloat(value)) || !isFinite(value);
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
  return dependencies.concat(EffectInputHelperDirective);
});
