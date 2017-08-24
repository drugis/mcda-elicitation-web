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
          } else if (scope.studyType === 'continuous') {
            newData.mu = inputState.mu;
            if (scope.continuous.type === 'SEnorm') {
              newData.sigma = inputState.stdErr;
              newData.type = 'dnorm';
            } else if (scope.continuous.type === 'SDnorm') {
              newData.sigma = inputState.sigma / Math.sqrt(inputState.sampleSize);
              newData.type = 'dnorm';
            } else if (scope.continuous.type === 'SEt') {
              newData.stdErr = inputState.stdErr;
              newData.dof = inputState.sampleSize - 1;
              newData.type = 'dt';
            } else if (scope.continuous.type === 'SDt') {
              newData.stdErr = inputState.sigma / Math.sqrt(inputState.sampleSize);
              newData.dof = inputState.sampleSize - 1;
              newData.type = 'dt';
            }
          } else {
            //survival
            if (_.isNumber(inputState.events) && _.isNumber(inputState.exposure)) {
              newData.alpha = inputState.events + 0.001;
              newData.beta = inputState.exposure + 0.001;
            }
            newData.type = 'dsurv';
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