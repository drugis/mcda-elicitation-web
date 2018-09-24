'use strict';
define(['lodash'], function(_) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = [
    'ManualInputService',
    '$timeout',
    'significantDigits'
  ];

  var EffectInputHelperDirective = function(
    ManualInputService,
    $timeout,
    significantDigits
  ) {
    return {
      restrict: 'E',
      scope: {
        'inputDataSource': '=',
        'alternative': '=',
        'inputData': '=',
        'changeCallback': '='
      },
      templateUrl: 'js/manualInput/effectInputHelperDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.updateUpperBound = updateUpperBound;
        scope.inputChanged = inputChanged;
        scope.confidenceIntervalNEChanged = confidenceIntervalNEChanged;

        //init
        var isEscPressed = false;

        initInputParameters();
        scope.inputData.label = ManualInputService.inputToString(scope.inputCell);
        scope.inputData.isInvalid = ManualInputService.getInputError(scope.inputCell);
        scope.changeCallback();

        scope.$on('open.af.dropdownToggle', function() {
          isEscPressed = false;
        });

        scope.$on('close.af.dropdownToggle', function() {
          if (!isEscPressed) {
            saveState();
          }
        });

        function updateUpperBound() {
          var id = scope.inputCell.inputParameters.id;
          if (scope.inputCell.isNormal && id === 'exactValueCI' && scope.inputCell.dataType === 'continuous' && scope.inputCell.parameterOfInterest === 'mean') {
            var uppperBound = 2 * scope.inputCell.firstParameter - scope.inputCell.secondParameter;
            scope.inputCell.thirdParameter = significantDigits(uppperBound);
          }
        }

        function saveState() {
          $timeout(function() {
            scope.inputData = scope.inputCell;
            scope.inputData.isInvalid = ManualInputService.getInputError(scope.inputCell);
            scope.inputData.label = ManualInputService.inputToString(scope.inputCell);
            $timeout(scope.changeCallback);
          });
        }

        function initInputParameters() {
          if (doInputParametersNeedUpdating(scope.inputDataSource, scope.inputData)) {
            scope.inputCell = _.cloneDeep(scope.inputDataSource);
          } else {
            scope.inputCell = _.cloneDeep(scope.inputData);
          }
          scope.inputParameterOptions = ManualInputService.getOptions(scope.inputCell);
          if (!scope.inputCell.inputParameters) {
            scope.inputCell.inputParameters = _.values(scope.inputParameterOptions)[0];
          } else {
            scope.inputCell.inputParameters = scope.inputParameterOptions[scope.inputCell.inputParameters.id];
          }
        }

        function inputChanged() {
          updateUpperBound();
          scope.error = ManualInputService.getInputError(scope.inputCell);
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            isEscPressed = true;
            scope.$broadcast('doClose.af.dropdownToggle');
          } else if (event.keyCode === ENTER) {
            scope.$broadcast('doClose.af.dropdownToggle');
          }
        }

        function doInputParametersNeedUpdating(inputDataSource, cell) {
          if (!cell.inputParameters) {
            return true;
          }
          var inputType = inputDataSource.inputType;
          var inputMethod = inputDataSource.inputMethod;
          var dataType = inputDataSource.dataType;
          return inputType !== cell.inputType ||
            (inputType === 'distribution' && inputMethod !== cell.inputMethod) ||
            (inputType === 'distribution' && inputMethod === 'assistedDistribution' && dataType !== cell.dataType) ||
            (inputType === 'effect' && dataType !== cell.dataType) ||
            (inputType === 'effect' && dataType === 'continuous' &&
              inputDataSource.parameterOfInterest !== cell.parameterOfInterest);
        }

        function confidenceIntervalNEChanged() {
          if (scope.inputCell.lowerBoundNE || scope.inputCell.upperBoundNE) {
            scope.inputCell.isNormal = false;
          }
        }
      }
    };
  };
  return dependencies.concat(EffectInputHelperDirective);
});
