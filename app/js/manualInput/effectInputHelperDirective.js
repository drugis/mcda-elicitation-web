'use strict';
define(['lodash'], function (_) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = ['ManualInputService', '$timeout'];

  var EffectInputHelperDirective = function (ManualInputService, $timeout) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'alternative': '=',
        'inputData': '=',
        'changeCallback': '='
      },
      templateUrl: 'js/manualInput/effectInputHelperDirective.html',
      link: function (scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.updateUpperBound = updateUpperBound;
        scope.checkInput = checkInput;

        // init
        scope.assistedDistributionOptions = {
          dichotomous: {
            label: 'dichotomous',
            firstParameter: 'Events',
            secondParameter: 'Sample size'
          },
          continuous: {
            stdErr: {
              label: 'Student\'s t, SE',
              firstParameter: 'Mean',
              secondParameter: 'Standard error',
              thirdParameter: 'Sample size'
            },
            stdDev: {
              label: 'Student\'s t, SD',
              firstParameter: 'Mean',
              secondParameter: 'Standard deviation',
              thirdParameter: 'Sample size'
            }
          },
          other: {
            label: 'other',
            firstParameter: 'Value'
          }
        };
        scope.manualDistributionOptions = {
          beta: {
            label: 'Beta',
            firstParameter: 'alpha',
            secondParameter: 'beta'
          },
          normal: {
            label: 'Normal',
            firstParameter: 'mean',
            secondParameter: 'SE'
          },
          gamma: {
            label: 'Gamma',
            firstParameter: 'alpha',
            secondParameter: 'beta'
          }
        };
        scope.dichotomousOptions = {
          decimal: {
            label: 'Decimal',
            firstParameter: 'Value',
            secondParameter: 'Sample size (optional)',
            canBeNormal: true
          },
          percentage: {
            label: 'Percentage',
            firstParameter: 'Value',
            secondParameter: 'Sample size (optional)',
            canBeNormal: true
          },
          fraction: {
            label: 'Fraction',
            firstParameter: 'Events',
            secondParameter: 'Sample size',
            canBeNormal: true
          }
        };
        scope.continuousOptions = {
          mean: {
            mean: {
              label: 'Mean',
              firstParameter: 'Mean'
            },
            meanSE: {
              label: 'Mean, SE',
              firstParameter: 'Mean',
              secondParameter: 'Standard error',
              canBeNormal: true
            },
            meanCI: {
              label: 'Mean, 95% C.I.',
              firstParameter: 'Mean',
              secondParameter: 'Lower bound',
              thirdParameter: 'Upper bound',
              canBeNormal: true
            }
          },
          median: {
            median: {
              label: 'Median',
              firstParameter: 'Median'
            },
            medianCI: {
              label: 'Median, 95% C.I.',
              firstParameter: 'Median',
              secondParameter: 'Lower bound',
              thirdParameter: 'Upper bound'
            }
          },
          cumulativeProbability: {
            value: {
              display: {
                percentage: 'Percentage',
                decimal: 'Decimal'
              },
              label: 'Value',
              firstParameter: 'Value'
            },
            valueCI: {
              display: {
                percentage: 'Percentage',
                decimal: 'Decimal'
              },
              label: 'Value, 95% C.I.',
              firstParameter: 'Value',
              secondParameter: 'Lower bound',
              thirdParameter: 'Upper bound'
            }
          }
        };
        scope.otherOptions = {
          value: {
            label: 'Value',
            firstParameter: 'Value'
          },
          valueSE: {
            label: 'Value, SE',
            firstParameter: 'Value',
            secondParameter: 'Standard error'
          },
          valueCI: {
            label: 'Value, 95% C.I.',
            firstParameter: 'Value',
            secondParameter: 'Lower bound',
            thirdParameter: 'Upper bound'
          }
        };
        var isEscPressed = false;

        initInputParameters();
        scope.inputData.label = ManualInputService.inputToString(scope.inputCell);

        scope.$on('open.af.dropdownToggle', function () {
          isEscPressed = false;
        });

        scope.$on('close.af.dropdownToggle', function () {
          if (!isEscPressed) {
            saveState();
          }
        });

        function updateUpperBound() {
          var label = scope.inputCell.inputParameters.label;
          if (scope.inputCell.isNormal &&
            (label === 'Mean, 95% C.I.' || label === 'Decimal' || label === 'Percentage' || label === 'Fraction')) {
            scope.inputCell.thirdParameter = (2 * scope.inputCell.firstParameter) - scope.inputCell.secondParameter;
          }
        }

        function saveState() {
          $timeout(function () {
            scope.inputData = scope.inputCell;
            scope.inputData.isInvalid = ManualInputService.checkInputValues(scope.inputCell);
            scope.inputData.label = ManualInputService.inputToString(scope.inputCell);
            $timeout(function () {
              scope.changeCallback();
            });
          });
        }

        function initInputParameters() {
          if (didCriterionChange(scope.criterion, scope.inputData)) {
            scope.inputCell = _.cloneDeep(scope.criterion);
          } else {
            scope.inputCell = _.cloneDeep(scope.inputData);
          }
          switch (scope.inputCell.inputType) {
            case 'distribution':
              setDistributionOptions();
              break;
            case 'effect':
              setEffectOptions();
              break;
          }
        }

        function setDistributionOptions() {
          var cell = scope.inputCell;
          switch (cell.inputMethod) {
            case 'assistedDistribution':
              setAssistedDistributionOptions();
              break;
            case 'manualDistribution':
              scope.options = scope.manualDistributionOptions;
              if (!cell.inputParameters || !_.find(scope.manualDistributionOptions, function (value) {
                return value.label === cell.inputParameters.label;
              })) {
                cell.inputParameters = scope.options.beta;
              }
              break;
          }
        }

        function setAssistedDistributionOptions() {
          var cell = scope.inputCell;
          switch (cell.dataType) {
            case 'dichotomous':
              scope.options = undefined;
              cell.inputParameters = scope.assistedDistributionOptions.dichotomous;
              break;
            case 'continuous':
              scope.options = scope.assistedDistributionOptions.continuous;
              if (!cell.inputParameters || cell.inputParameters.label !== 'Student\'s t, SD') {
                cell.inputParameters = scope.options.stdErr;
              }
              break;
            case 'other':
              scope.options = undefined;
              cell.inputParameters = scope.assistedDistributionOptions.other;
              break;
          }
        }

        function setEffectOptions() {
          var cell = scope.inputCell;
          switch (cell.dataType) {
            case 'dichotomous':
              scope.options = scope.dichotomousOptions;
              if (!cell.inputParameters ||
                (cell.inputParameters.label !== scope.options.percentage.label &&
                  cell.inputParameters.label !== scope.options.fraction.label)) {
                cell.inputParameters = scope.options.decimal;
              }
              break;
            case 'continuous':
              var parameterOfInterest = cell.parameterOfInterest;
              scope.options = scope.continuousOptions[parameterOfInterest];
              if (parameterOfInterest === 'cumulativeProbability') {
                if (!cell.inputParameters || cell.inputParameters.label === 'Value, 95% C.I.') {
                  cell.inputParameters = scope.options.valueCI;
                } else {
                  cell.inputParameters = scope.options.value;
                }
                if (!cell.display) {
                  cell.display = 'percentage';
                }
              } else if (parameterOfInterest === 'mean') {
                if (!cell.inputParameters || cell.inputParameters.label !== 'Mean, SE' && cell.inputParameters.label !== 'Mean, 95% C.I.') {
                  cell.inputParameters = scope.options[parameterOfInterest];
                }
              } else if (parameterOfInterest === 'median') {
                if (!cell.inputParameters || cell.inputParameters.label !== 'Median, 95% C.I.') {
                  cell.inputParameters = scope.options[parameterOfInterest];
                }
              }
              break;
            case 'other':
              scope.options = scope.otherOptions;
              if (!cell.inputParameters ||
                (cell.inputParameters.label !== 'Value, SE' && cell.inputParameters.label !== 'Value, 95% C.I.')) {
                cell.inputParameters = scope.options.value;
              }
              break;
          }
        }

        function checkInput() {
          scope.error = ManualInputService.checkInputValues(scope.inputCell);
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            isEscPressed = true;
            scope.$broadcast('doClose.af.dropdownToggle');
          } else if (event.keyCode === ENTER) {
            scope.$broadcast('doClose.af.dropdownToggle');
          }
        }

        function didCriterionChange(criterion, cell) {
          var inputType = criterion.inputType;
          var inputMethod = criterion.inputMethod;
          var dataType = criterion.dataType;
          return inputType !== cell.inputType ||
            (inputType === 'distribution' && inputMethod !== cell.inputMethod) ||
            (inputType === 'distribution' && inputMethod === 'assistedDistribution' && dataType !== cell.dataType) ||
            (inputType === 'effect' && dataType !== cell.dataType) ||
            (inputType === 'effect' && dataType === 'continuous' && criterion.parameterOfInterest !== cell.parameterOfInterest);
        }
      }
    };
  };
  return dependencies.concat(EffectInputHelperDirective);
});