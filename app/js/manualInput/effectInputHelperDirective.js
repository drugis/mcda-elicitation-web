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
        scope.continuous = {
          type: 'standard deviation'
        };
        scope.inputState = {};

        scope.$on('dropdown.hasClosed', function() {
          $timeout(function() {
            scope.inputData = createDistribution(scope.inputData, scope.inputState);
            scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
            scope.inputData.label = ManualInputService.inputToString(scope.inputData);
            $timeout(function() {
              scope.changeCallback();
            });
          });
        });

        function createDistribution(inputData, inputState) {
          var newData = _.cloneDeep(inputData);
          if (scope.studyType === 'dichotomous') {
            newData.alpha = inputState.count + 1;
            newData.beta = inputState.sampleSize - inputState.count + 1;
            newData.type = 'dbeta';
          } else {
            newData.mu = inputState.mu;
            if (scope.continuous.type === 'standard deviation') {
              newData.sigma = inputState.sigma;
              newData.type = 'dnorm';
            } else {
              newData.stdErr = inputState.stdErr;
              newData.dof = inputState.sampleSize - 1;
              newData.type = 'dt';
            }
          }
          return newData;
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            scope.$broadcast('dropdown.closeEvent');
          } else if (event.keyCode === ENTER) {
            $timeout(function() {
              scope.inputData = createDistribution(scope.inputData, scope.inputState);
              scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
              scope.inputData.label = ManualInputService.inputToString(scope.inputData);
              scope.changeCallback();
              scope.$broadcast('dropdown.closeEvent');
            });
          }
        }
      }
    };
  };
  return dependencies.concat(EffectInputHelperDirective);
});