'use strict';
define(['lodash'], function(_) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = ['ManualInputService', '$timeout'];

  var EffectInputHelperDirective = function(ManualInputService, $timeout) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'treatment': '=',
        'inputData': '=',
        'studyType': '=',
        'changeCallback': '='
      },
      templateUrl: 'app/js/manualInput/effectInputHelperDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        // variables
        var isEscPressed = false;
        scope.continuous = {
          type: 'SEt'
        };
        scope.inputState = {};
        scope.continuousOptions = [{
            label: 'Mean, SE (normal distribution)',
            short: 'SEnorm'
          },
          {
            label: 'Mean, std. dev., N (normal distribution)',
            short: 'SDnorm'
          },
          {
            label: 'Mean, SE, N (t distribution)',
            short: 'SEt'
          },
          {
            label: 'Mean, std. dev., N (t distribution)',
            short: 'SDt'
          }
        ];
        scope.inputData.label = ManualInputService.inputToString(scope.inputData);

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
            scope.inputData = ManualInputService.createDistribution(scope.inputData, scope.inputState, scope.studyType, scope.continuous.type);
            scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
            scope.inputData.label = ManualInputService.inputToString(scope.inputData);
            $timeout(function() {
              scope.changeCallback();
            });
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