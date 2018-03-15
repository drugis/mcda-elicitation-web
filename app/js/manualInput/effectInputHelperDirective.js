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
        'changeCallback': '='
      },
      templateUrl: 'js/manualInput/effectInputHelperDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        // variables
        var isEscPressed = false;
        scope.continuous = {
          type: 'SEt'
        };
        scope.inputCell = _.cloneDeep(scope.inputData);
        scope.inputCell.continuousType = scope.inputCell.continuousType ? scope.inputCell.continuousType : 'SEt';
        scope.inputCell.exactType = scope.inputCell.exactType ? scope.inputCell.exactType : 'exact';
        scope.continuousOptions = [{
          label: 'Mean, SE (normal distribution)',
          short: 'SEnorm'
        }, {
          label: 'Mean, std. dev., N (normal distribution)',
          short: 'SDnorm'
        }, {
          label: 'Mean, SE, N (t distribution)',
          short: 'SEt'
        }, {
          label: 'Mean, std. dev., N (t distribution)',
          short: 'SDt'
        }];
        scope.exactOptions = [{
          label: 'μ',
          short: 'exact'
        }, {
          label: 'μ, SE',
          short: 'exactSE'
        }, {
          label: 'μ, 95% C.I.',
          short: 'exactConv'
        }];
        scope.inputData.label = ManualInputService.inputToString(
          ManualInputService.createDistribution(scope.inputCell, scope.criterion));

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
            var distributionData = ManualInputService.createDistribution(
              scope.inputCell, scope.criterion);
            scope.inputData = scope.inputCell;
            scope.inputData.isInvalid = ManualInputService.isInvalidCell(distributionData);
            scope.inputData.label = ManualInputService.inputToString(distributionData);
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