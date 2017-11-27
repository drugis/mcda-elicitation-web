'use strict';
define(['lodash', 'angular', 'mcda/controllers/helpers/util', 'mcda/controllers/helpers/wizard'],
  function(_, angular, Util, Wizard) {
    var dependencies = ['$scope', '$state', '$stateParams', '$injector', '$timeout',
      'currentScenario',
      'taskDefinition',
      'PartialValueFunctionService'
    ];
    var ExactSwingController = function($scope, $state, $stateParams, $injector, $timeout,
      currentScenario,
      taskDefinition,
      PartialValueFunctionService
    ) {
      $scope.title = title;
      $scope.initialize = initialize;
      $scope.canSave = canSave;
      $scope.save = save;

      var pvf = PartialValueFunctionService;
      $scope.pvf = pvf;

      function title(step, total) {
        var base = 'Exact Matching';
        if (step > total) {
          return base + ' (DONE)';
        }
        return base + ' (' + step + '/' + total + ')';
      }

      function buildInitial(criteria, criterionA, criterionB, step) {
        var bounds = pvf.getBounds(criteria[criterionA]);
        var state = {
          step: step,
          total: _.size(criteria) - 1,
          criterionA: criterionA,
          criterionB: criterionB,
          choice: (bounds[0] + bounds[1]) / 2,
          sliderOptions: {
            floor: Math.ceil(bounds[0] * 1000) / 1000,
            ceil: Math.floor(bounds[1] * 1000) / 1000,
            step: Math.abs(bounds[0] - bounds[1]) / 100,
            precision: 2
          }
        };
        return state;
      }

      function initialize(state) {
        var criteria = state.problem.criteria;
        state.prefs = Util.getOrdinalPreferences(state.prefs); // remove pre-existing ordinal/exact preferences
        state = _.extend(state, {
          'criteriaOrder': Util.getCriteriaOrder(state.prefs),
          title: title(1, _.size(criteria) - 1)

        });
        state = _.extend(state, buildInitial(criteria, state.criteriaOrder[0], state.criteriaOrder[1], 1));
        $timeout(function() {
          $scope.$broadcast('rzSliderForceRender');
        }, 100);
        return state;
      }


      function validChoice(state) {
        var criteria = state.problem.criteria;
        if (!state) {
          return false;
        }
        if (state.type === 'done') {
          return true;
        }
        // criterionA always has higher weight than B. The value may not be equal to the worst value of the most
        // important criterion, to prevent divide by zero.
        return state.choice !== PartialValueFunctionService.worst(criteria[state.criterionA]);
      }

      function nextState(state) {
        var criteria = state.problem.criteria;

        if (!validChoice(state)) {
          return null;
        }
        var order = state.criteriaOrder;

        var idx = _.indexOf(order, state.criterionB);
        var next;
        if (idx > order.length - 2) {
          next = {
            type: 'done',
            step: idx + 1
          };
        } else {
          next = buildInitial(criteria, order[idx], order[idx + 1], idx + 1);
        }

        function getRatio(state) {
          var u = pvf.map(criteria[state.criterionA]);
          return 1 / u(state.choice);
        }

        next.prefs = angular.copy(state.prefs);
        next.prefs.push({
          criteria: [order[idx - 1], order[idx]],
          ratio: getRatio(state),
          type: 'exact swing'
        });
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
          fields: ['prefs', 'total', 'choice', 'criteriaOrder', 'criterionA', 'criterionB'],
          nextState: nextState,
          standardize: _.identity,
          initialize: _.partial(initialize, taskDefinition.clean($scope.aggregateState))
        }
      });
    };
    return dependencies.concat(ExactSwingController);
  });