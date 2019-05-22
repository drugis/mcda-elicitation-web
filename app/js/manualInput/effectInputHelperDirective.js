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
        scope.inputChanged = inputChanged;

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

        function saveState() {
          $timeout(function() {
            scope.inputData = scope.inputCell;
            scope.inputData.isInvalid = ManualInputService.getInputError(scope.inputCell);
            scope.inputData.label = ManualInputService.inputToString(scope.inputCell);
            $timeout(scope.changeCallback);
          });
        }

        function initInputParameters() {
          scope.inputCell = _.cloneDeep(scope.inputData);
          scope.inputParameterOptions = ManualInputService.getOptions(scope.inputCell);
          if (!scope.inputCell.inputParameters) {
            scope.inputCell.inputParameters = _.values(scope.inputParameterOptions)[0];
          } else {
            scope.inputCell.inputParameters = scope.inputParameterOptions[scope.inputCell.inputParameters.id];
          }
        }

        function inputChanged() {
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
      }
    };
  };
  return dependencies.concat(EffectInputHelperDirective);
});
