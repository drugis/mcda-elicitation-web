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
            secondParameter: 'Sample size (optional)'
          },
          percentage: {
            label: 'Percentage',
            firstParameter: 'Value',
            secondParameter: 'Sample size (optional)'
          },
          fraction: {
            label: 'Fraction',
            firstParameter: 'Events',
            secondParameter: 'Sample size'
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
              secondParameter: 'Standard error'
            },
            meanCI: {
              label: 'Mean, 95% C.I.',
              firstParameter: 'Mean',
              secondParameter: 'Lower bound',
              thirdParameter: 'Upper bound'
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
          if (scope.inputCell.isNormal) {
            scope.inputCell.upperBound = (2 * scope.inputCell.value) - scope.inputCell.lowerBound;
          }
        }

        function saveState() {
          $timeout(function () {
            if (scope.inputCell.isNormal && scope.inputCell.exactType === 'exactConf') {
              scope.inputCell.upperBound = (2 * scope.inputCell.value) - scope.inputCell.lowerBound;
            }
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
          switch (scope.inputCell.inputMethod) {
            case 'assistedDistribution':
              setAssistedDistributionOptions();
              break;
            case 'manualDistribution':
              scope.options = scope.manualDistributionOptions;
              if (!scope.inputCell.inputParameters || !_.find(scope.manualDistributionOptions, function (value) {
                return value.label === scope.inputCell.inputParameters.label;
              })) {
                scope.inputCell.inputParameters = scope.options.beta;
              }
              break;
          }
        }

        function setAssistedDistributionOptions() {
          switch (scope.inputCell.dataType) {
            case 'dichotomous':
              scope.options = undefined;
              scope.inputCell.inputParameters = scope.assistedDistributionOptions.dichotomous;
              break;
            case 'continuous':
              scope.options = scope.assistedDistributionOptions.continuous;
              if (scope.inputCell.inputParameters.label !== 'Student\'s t, SE' &&
                scope.inputCell.inputParameters.label !== 'Student\'s t, SD') {
                scope.inputCell.inputParameters = scope.options.stdErr;
              }
              break;
          }
        }

        function setEffectOptions() {
          switch (scope.inputCell.dataType) {
            case 'dichotomous':
              scope.options = scope.dichotomousOptions;
              if (!scope.inputCell.inputParameters || scope.inputCell.inputParameters.label !== scope.options.decimal.label) {
                scope.inputCell.inputParameters = scope.options.decimal;
              }
              break;
            case 'continuous':
              var parameterOfInterest = scope.inputCell.parameterOfInterest;
              scope.options = scope.continuousOptions[parameterOfInterest];
              if (parameterOfInterest === 'cumulativeProbability') {
                if (scope.inputCell.inputParameters.label !== 'Value, 95% C.I.') {
                  scope.inputCell.inputParameters = scope.options.value;
                }
                if (!scope.inputCell.display) {
                  scope.inputCell.display = 'percentage';
                }
              } else {
                scope.inputCell.inputParameters = scope.options[parameterOfInterest];
              }
              break;
            case 'other':
              scope.options = scope.otherOptions;
              if (!scope.inputCell.inputParameters || scope.inputCell.inputParameters.label !== 'Value, SE' ||
                scope.inputCell.inputParameters.label !== 'Value, 95% C.I.') {
                scope.inputCell.inputParameters = scope.options.value;
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
          return criterion.inputType !== cell.inputType ||
            (criterion.inputType === 'distribution' && criterion.inputMethod !== cell.inputMethod) ||
            (criterion.inputType === 'distribution' && criterion.inputMethod === 'assistedDistribution' && criterion.dataType !== cell.dataType) ||
            (criterion.inputType === 'effect' && criterion.dataType !== cell.dataType) ||
            (criterion.inputType === 'effect' && criterion.dataType === 'continuous' && criterion.parameterOfInterest !== cell.parameterOfInterest);
        }
      }
    };
  };
  return dependencies.concat(EffectInputHelperDirective);
});