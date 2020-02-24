'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = [
    'EffectInputHelperService',
    '$timeout'
  ];

  var EffectInputHelperDirective = function(
    EffectInputHelperService,
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
            scope.cell = EffectInputHelperService.saveCell(scope.inputCell);
            $timeout(scope.changeCallback);
          });
        }

        function initInputParameters() {
          scope.inputParameterOptions = EffectInputHelperService.getOptions(scope.inputType);
          scope.cell.inputParameters = EffectInputHelperService.getInputParameters(scope.cell.inputParameters, scope.inputParameterOptions);
          scope.cell.constraint = EffectInputHelperService.getCellConstraint(scope.unitOfMeasurement.selectedOption.type);
          scope.inputCell = angular.copy(scope.cell);
          inputChanged();
          scope.cell.label = EffectInputHelperService.inputToString(scope.inputCell);
          scope.cell.isInvalid = EffectInputHelperService.getInputError(scope.inputCell);
          scope.changeCallback();
        }

        function inputChanged() {
          scope.inputCell = EffectInputHelperService.updateParameterConstraints(scope.inputCell, scope.unitOfMeasurement);
          scope.inputCell = EffectInputHelperService.removeTextValue(scope.inputCell);
          scope.error = EffectInputHelperService.getInputError(scope.inputCell);
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
