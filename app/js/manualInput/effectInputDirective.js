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
        scope.criterion.hash = scope.criterion.$$hashKey.split(':')[1];
        scope.treatment.hash = scope.treatment.$$hashKey.split(':')[1];
        scope.keyCheck = keyCheck;
        scope.render = ManualInputService.inputToString;
        scope.cacheInput = cacheInput;
        scope.distributionOptions = [{
          name: 'exact values',
          type: 'exact'
        }, {
          name: 'normal distribution',
          type: 'dnorm'
        }, {
          name: 'beta distribution',
          type: 'dbeta'
        }];

        scope.$on('dropdown.hasClosed', function() {
          $timeout(function() {
            scope.inputData = scope.inputState;
            scope.inputData.label = ManualInputService.inputToString(scope.inputData);
            scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
          });
          $timeout(function() {
            scope.changeCallback();
          });
        });

        function cacheInput() {
          scope.inputState = _.cloneDeep(scope.inputData);
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            scope.$broadcast('dropdown.closeEvent');
          } else if (event.keyCode === ENTER) {
            scope.inputData = scope.inputState;
            scope.inputData.label = ManualInputService.inputToString(scope.inputData);
            scope.inputData.isInvalid = ManualInputService.isInvalidCell(scope.inputData);
            $timeout(function() {
              scope.changeCallback();
            });
            scope.$broadcast('dropdown.closeEvent');
          }
        }
      }
    };
  };
  return dependencies.concat(EffectInputDirective);
});