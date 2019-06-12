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
        scope.constraintChanged = constraintChanged;

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

        scope.$watch('cell', initInputParameters);

        function saveState() {
          $timeout(function() {
            scope.cell = scope.inputCell;
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
          scope.inputCell = _.cloneDeep(scope.cell);
          constraintChanged();
          scope.cell.label = ManualInputService.inputToString(scope.inputCell);
          scope.cell.isInvalid = ManualInputService.getInputError(scope.inputCell);
          scope.changeCallback();
        }

        function inputChanged() {
          scope.error = ManualInputService.getInputError(scope.inputCell);
        }

        function constraintChanged() {
          var inputParameters = scope.inputCell.inputParameters;
          updateParameter(inputParameters.firstParameter);
          updateParameter(inputParameters.secondParameter);
          updateParameter(inputParameters.thirdParameter);
          inputChanged();
        }

        function updateParameter(parameter) {
          if (parameter && parameter.label !== 'Sample size') {
            parameter.constraints = ManualInputService.updateConstraints(scope.inputCell.constraint, parameter.constraints);
          }
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
