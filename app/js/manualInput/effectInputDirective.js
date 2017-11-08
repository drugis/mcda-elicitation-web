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
      templateUrl: 'js/manualInput/effectInputDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.cacheInput = cacheInput;
        // variables
        var isEscPressed = false;

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

        scope.$on('open.af.dropdownToggle', function() {
          isEscPressed = false;
        });

        scope.$on('close.af.dropdownToggle', function() {
          if (!isEscPressed) {
            saveState();
          }
        });

        function cacheInput() {
          scope.inputState = _.cloneDeep(scope.inputData);
        }

        function saveState() {
          $timeout(function() {
            scope.inputData = scope.inputState;
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
  return dependencies.concat(EffectInputDirective);
});