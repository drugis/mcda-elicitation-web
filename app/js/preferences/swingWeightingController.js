'use strict';
define(['lodash', 'angular', 'mcda/controllers/helpers/util', 'mcda/controllers/helpers/wizard'],
  function(_, angular, Util, Wizard) {
    var dependencies = ['$scope', '$state', '$stateParams', '$injector', '$timeout',
      'currentScenario',
      'taskDefinition',
      'PartialValueFunctionService'
    ];
    var SwingWeightingController = function($scope, $state, $stateParams, $injector, $timeout,
      currentScenario,
      taskDefinition,
      PartialValueFunctionService
    ) {
      $scope.title = title;
      $scope.initialize = initialize;
      $scope.canSave = canSave;
      $scope.save = save;

      $scope.pvf = PartialValueFunctionService;

      function title(step, total) {
        var base = 'SWING weighting';
        if (step > total) {
          return base + ' (DONE)';
        }
        return base + ' (' + step + '/' + total + ')';
      }

      function buildInitial() {
        var state = {
          step: 1,
          total: 2
        };
        return state;
      }

      function initialize(state) {
        var criteria = state.problem.criteria;
        state = _.extend(state, {
          title: title(1, 2),
        });
        state = _.extend(state, buildInitial(criteria, 1));
        return state;
      }

      function validChoice(state) {
        if (!state) {
          return false;
        }
        if (state.type === 'done') {
          return true;
        }
        return state.choice;
      }

      function nextState(state) {
        if (!validChoice(state)) {
          return null;
        }

        var next;
        if (state.step === 1) {
          // go to step 2
          next = {
            step: state.step + 1,
            values: _.reduce(state.problem.criteria, function(accum, criterion, key) {
              accum[key] = 100;
              return accum;
            }, {}),
            sliderOptions: {
              floor: 1,
              ceil: 100,
              step: 1,
              precision: 0
            },
            sliderOptionsDisabled: {
              disabled: true,
              floor: 1,
              ceil: 100,
              step: 1,
              precision: 0
            }

          };
          $timeout(function() {
            $scope.$broadcast('rzSliderForceRender');
          }, 100);
        } else if (state.step === 2) {
          next = {
            type: 'done',
            step: state.step + 1
          };
          // push stuff to prefs todo
        } else {
          next = buildInitial();
        }

        next.title = title(next.step, next.total);
        return _.extend(angular.copy(state), next);
      }

      function canSave(state) {
        return state && state.step === state.total + 1;
      }

      function save(state) {
        currentScenario.state = _.pick(state, ['problem', 'prefs']);
        currentScenario.$save($stateParams, function(scenario) {
          $scope.$emit('elicit.resultsAccessible', scenario);
          $state.go('preferences');
        });
      }

      $injector.invoke(Wizard, this, {
        $scope: $scope,
        handler: {
          validChoice: validChoice,
          fields: ['total', 'choice', 'step'],
          nextState: nextState,
          standardize: _.identity,
          initialize: _.partial(initialize, taskDefinition.clean($scope.aggregateState))
        }
      });
    };
    return dependencies.concat(SwingWeightingController);
  });