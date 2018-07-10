'use strict';
define(['lodash', 'angular', 'mcda/controllers/wizard'], function(_, angular, Wizard) {
  var dependencies = ['$state',
    '$injector',
    '$timeout',
    'PartialValueFunctionService',
    'OrderingService'
  ];
  var SwingWeightingService = function($state,
    $injector,
    $timeout,
    PartialValueFunctionService,
    OrderingService
  ) {

    function initWeightingScope(
      scope,
      $stateParams,
      currentScenario,
      taskDefinition,
      sliderOptions,
      getValues,
      baseTitle,
      toBackEnd
    ) {
      // functions
      scope.canSave = canSave;
      scope.save = save;
      scope.cancel = cancel;

      // init
      scope.pvf = PartialValueFunctionService;
      OrderingService.getOrderedCriteriaAndAlternatives(scope.aggregateState.problem, $stateParams).then(function(orderings) {
        scope.alternatives = orderings.alternatives;
        scope.criteria = orderings.criteria;
      });

      function title(step, total) {
        return baseTitle + ' (' + step + '/' + total + ')';
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

        var next = {
          step: state.step + 1,
          values: getValues(state.problem.criteria),
          oneHundred: 100,
          sliderOptions: sliderOptions,
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
          scope.$broadcast('rzSliderForceRender');
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
          .map(toBackEnd(state.mostImportantCriterion))
          .value();

        currentScenario.state = {
          problem: state.problem
        };
        currentScenario.state.prefs = prefs;
        currentScenario.$save($stateParams, function(scenario) {
          scope.$emit('elicit.resultsAccessible', scenario);
          $state.go('preferences');
        });
      }

      function cancel() {
        $state.go('preferences');
      }

      $injector.invoke(Wizard, undefined, {
        $scope: scope,
        handler: {
          validChoice: validChoice,
          fields: ['total', 'mostImportantCriterion', 'step'],
          nextState: nextState,
          standardize: _.identity,
          initialize: _.partial(initialize, taskDefinition.clean(scope.aggregateState))
        }
      });
    }

    return {
      initWeightingScope: initWeightingScope
    };
  };
  return dependencies.concat(SwingWeightingService);
});
