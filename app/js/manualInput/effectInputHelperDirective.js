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

        scope.changeCallback();

        scope.$on('open.af.dropdownToggle', function() {
          isEscPressed = false;
        });

        scope.$on('close.af.dropdownToggle', function() {
          if (!isEscPressed) {
            saveState();
          }
        });

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
          scope.inputParameterOptions = ManualInputService.getOptions(scope.inputType);
        }

        function inputChanged() {
          scope.error = ManualInputService.getInputError(scope.inputCell);
        }

        function constraintChanged() {
          var inputParameters = scope.inputCell.inputParameters;
          if (inputParameters.firstParameter) {
            inputParameters.firstParameter.constraints =
              updateConstraints(inputParameters.firstParameter.constraints);
          }
          if (inputParameters.secondParameter) {
            inputParameters.secondParameter.constraints =
              updateConstraints(inputParameters.secondParameter.constraints);
          }
          if (inputParameters.thirdParameter) {
            inputParameters.thirdParameter.constraints =
              updateConstraints(inputParameters.thirdParameter.constraints);
          }
          inputChanged();
        }

        function updateConstraints(constraints) {
          var newConstraints = angular.copy(constraints);
          newConstraints = removeProportionConstraints(constraints);
          switch (scope.inputCell.constraint) {
            case scope.constraints[1].label:
              newConstraints.push(scope.constraints[1]);
              break;
            case scope.constraints[2].label:
              newConstraints.push(scope.constraints[2]);
              break;
          }
          return newConstraints;
        }

        function removeProportionConstraints(cellConstraints) {
          return _.reject(cellConstraints, function(constraint) {
            return constraint.label === scope.constraints[1].label || constraint.label === scope.constraints[2].label;
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
  return dependencies.concat(EffectInputHelperDirective);
});
