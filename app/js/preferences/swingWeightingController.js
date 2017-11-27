'use strict';
define(['lodash', 'angular', 'mcda/controllers/helpers/wizard'],
  function(_, angular, Wizard) {
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
      // functions
      $scope.canSave = canSave;
      $scope.save = save;
      $scope.cancel = cancel;

      // init
      $scope.pvf = PartialValueFunctionService;

      function title(step, total) {
        var base = 'Swing weighting';
        return base + ' (' + step + '/' + total + ')';
      }

      function initialize(state) {
        state = _.extend(state, {
          title: title(1, 2),
          step: 1,
          total: 2
        });
        return state;
      }

      function validChoice(state) {
        if (!state) {
          return false;
        }
        return state.mostImportantCriterion;
      }

      function nextState(state) {
        if (!validChoice(state)) {
          return null;
        }

        var next;
        next = {
          step: state.step + 1,
          values: _.reduce(state.problem.criteria, function(accum, criterion, key) {
            accum[key] = 100;
            return accum;
          }, {}),
          sliderOptions: {
            floor: 1,
            ceil: 100,
            translate: function(value) {
              return value + '%';
            }
          },
          sliderOptionsDisabled: {
            disabled: true,
            floor: 1,
            ceil: 100,
            translate: function(value) {
              return value + '%';
            }
          }
        };
        $timeout(function() {
          $scope.$broadcast('rzSliderForceRender');
        }, 100);


        next.title = title(next.step, state.total);
        return _.extend(angular.copy(state), next);
      }

      function canSave(state) {
        return state && state.step === 2;
      }

      function save(state) {
        var prefs = _(state.values)
          .omit(state.mostImportantCriterion)
          .map(function(value, key) {
            return {
              type: 'exact swing',
              ratio: 1 / (value / 100),
              criteria: [state.mostImportantCriterion, key]
            };
          })
          .value();

        currentScenario.state = {
          problem: state.problem
        };
        currentScenario.state.prefs = prefs;
        currentScenario.$save($stateParams, function(scenario) {
          $scope.$emit('elicit.resultsAccessible', scenario);
          $state.go('preferences');
        });
      }

      function cancel() {
        $state.go('preferences');
      }

      $injector.invoke(Wizard, this, {
        $scope: $scope,
        handler: {
          validChoice: validChoice,
          fields: ['total', 'mostImportantCriterion', 'step'],
          nextState: nextState,
          standardize: _.identity,
          initialize: _.partial(initialize, taskDefinition.clean($scope.aggregateState))
        }
      });
    };
    return dependencies.concat(SwingWeightingController);
  });