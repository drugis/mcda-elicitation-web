'use strict';
define(['lodash'], function(_) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = ['ManualInputService', '$timeout'];

  var EffectInputDirective = function(ManualInputService, $timeout) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'treatment': '=',
        'inputData': '=',
        'changeCallback': '='
      },
      templateUrl: 'app/js/manualInput/effectInputDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.cacheInput = cacheInput;
        // variables
        if (scope.criterion.dataType === 'continuous') {
          scope.distributionOptions = [{
            name: 'exact',
            type: 'exact'
          }, {
            name: 'Normal',
            type: 'dnorm'
          }];
        } else if (scope.criterion.dataType === 'dichotomous') {
          scope.distributionOptions = [{
            name: 'exact',
            type: 'exact'
          }, {
            name: 'Beta',
            type: 'dbeta'
          }];
        } else if (scope.criterion.dataType === 'survival') {
          scope.distributionOptions = [{
            name: 'hazard(Gamma)',
            type: 'dsurv'
          }];
        }
        scope.inputData.label = ManualInputService.inputToString(scope.inputData);

        scope.$on('dropdown.hasClosed', function() {
          $timeout(function() {
            scope.inputData = scope.inputState;
            scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
            scope.inputData.label = ManualInputService.inputToString(scope.inputData);
            $timeout(function() {
              scope.changeCallback();
            });
          });
        });

        function cacheInput() {
          scope.inputState = _.cloneDeep(scope.inputData);
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            scope.$broadcast('dropdown.closeEvent');
          } else if (event.keyCode === ENTER) {
            $timeout(function() {
              scope.inputData = scope.inputState;
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
  return dependencies.concat(EffectInputDirective);
});
