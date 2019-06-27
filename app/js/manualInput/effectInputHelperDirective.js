'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = [
    'ManualInputService',
    'ConstraintService',
    '$timeout'
  ];

  var EffectInputHelperDirective = function(
    ManualInputService,
    ConstraintService,
    $timeout
  ) {
    return {
      restrict: 'E',
      scope: {
        'alternative': '=',
        'cell': '=',
        'changeCallback': '=',
        'inputType': '='
      },
      templateUrl: 'js/manualInput/effectInputHelperDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.inputChanged = inputChanged;

        //init
        var isEscPressed = false;
        scope.constraints = [{
          label: 'None'
        },
        ConstraintService.decimal(),
        ConstraintService.percentage()
        ];

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
          if (!scope.cell.inputParameters) {
            scope.cell.inputParameters = _.values(scope.inputParameterOptions)[0];
          } else {
            scope.cell.inputParameters = scope.inputParameterOptions[scope.cell.inputParameters.id];
          }
          if (!scope.cell.constraint) {
            scope.cell.constraint = scope.constraints[0].label;
          }
          scope.inputCell = ManualInputService.updateParameterConstraints(scope.cell);
          inputChanged();
          scope.cell.label = ManualInputService.inputToString(scope.inputCell);
          scope.cell.isInvalid = ManualInputService.getInputError(scope.inputCell);
          scope.changeCallback();
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
