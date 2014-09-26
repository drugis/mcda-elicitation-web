'use strict';
define(['mcda/config', 'angular', 'underscore'],
  function(Config, angular, _) {
    return ['$rootScope', '$scope', 'handler', 'MCDAPataviService',
      function($rootScope, $scope, handler, MCDAPataviService) {
        $rootScope.noProgress = true;

        var calculateIntermediateResults = function(state, standardizeFn) {
          var prefs = standardizeFn(state.prefs);
          var data = _.extend(state.problem, {
            "preferences": prefs,
            "method": "smaa"
          });
          var task = MCDAPataviService.run(data);

          var successHandler = function(results) {
            $scope.$root.$safeApply($scope, function() {
              state.results = results.results;
              $rootScope.noProgress = false;
            });
          };

          var errorHandler = function(code, error) {
            var message = {
              code: (code && code.desc) ? code.desc : code,
              cause: error
            };
            $scope.$root.$broadcast("error", message);
          };

          var updateHandler = _.throttle(function(update) {
            var progress = parseInt(update);
            if (progress > state.progress) {
              state.progrss = progress;
            }
          }, 30);

          state.progress = 0;
          task.then(successHandler, errorHandler, updateHandler);
          return state;
        };

        var PERSISTENT_FIELDS = ["problem", "type", "prefs"];
        var previousSteps = [];
        var nextSteps = [];

        $scope.currentStep = (function() {
          var state;
          if (!_.isUndefined(handler.initialize)) {
            state = handler.initialize();
            if (handler.hasIntermediateResults) {
              calculateIntermediateResults(state, handler.standardize);
            }
          }
          return state || {};
        })();

        $scope.canProceed = function(currentStep) {
          return (handler && handler.validChoice(currentStep)) || false;
        };

        $scope.canReturn = function() {
          return previousSteps.length > 0;
        };

        $scope.nextStep = function(currentStep) {
          if (!$scope.canProceed(currentStep)) return false;
          var choice = currentStep.choice;

          // History handling
          previousSteps.push(currentStep);
          var nextStep = nextSteps.pop();
          if (nextStep && _.isEqual(nextStep.previousChoice, choice)) {
            $scope.currentStep = nextStep;
            return true;
          } else {
            nextSteps = [];
          }

          currentStep = _.pick(currentStep, PERSISTENT_FIELDS.concat(handler.fields));
          nextStep = handler.nextState(currentStep);

          nextStep.previousChoice = choice;

          $scope.currentStep = nextStep;

          if (handler.hasIntermediateResults) {
            calculateIntermediateResults($scope.currentStep, handler.standardize);
          }

          return true;
        };

        $scope.previousStep = function() {
          if (previousSteps.length == 0) return false;
          nextSteps.push(angular.copy($scope.currentStep));

          var previousStep = previousSteps.pop();
          $scope.currentStep = previousStep;
          return true;
        };

      }
    ];
  });
