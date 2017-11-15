'use strict';
define(['lodash', 'angular', 'mcda/controllers/helpers/util', 'mcda/controllers/helpers/wizard'], function(_, angular, Util, Wizard) {

  return function($scope, $state, $stateParams, $injector, $timeout, currentScenario, taskDefinition, PartialValueFunctionService) {
    $scope.pvf = PartialValueFunctionService;
    $scope.canSave = canSave;
    $scope.save = save;

    function title(step, total) {
      var base = 'Interval SWING weighting';
      if (step > total) {
        return base + ' (DONE)';
      }
      return base + ' (' + step + '/' + total + ')';
    }

    function buildInitial(criteria, criterionA, criterionB, step) {
      var bounds = PartialValueFunctionService.getBounds(criteria[criterionA]);
      var increasing = PartialValueFunctionService.isIncreasing(criteria[criterionA]);
      return {
        step: step,
        total: _.size(criteria) - 1,
        criterionA: criterionA,
        criterionB: criterionB,
        best: function() {
          return increasing ? this.choice.upper : this.choice.lower;
        },
        worst: function() {
          return increasing ? this.choice.lower : this.choice.upper;
        },
        choice: {
          lower: Math.ceil(bounds[0]*100)/100, 
          upper: Math.floor(bounds[1]*100)/100
        },
        sliderOptions: {
          floor: Math.ceil(bounds[0]*1000)/1000,
          ceil: Math.floor(bounds[1]*1000)/1000,
          step: Math.abs(bounds[0] - bounds[1]) / 100,
          precision: 3,
          noSwitching: true
        }
      };
    }

    function initialize(state) {
      var criteria = state.problem.criteria;
      state.prefs = Util.getOrdinalPreferences(state.prefs); // remove pre-existing ordinal/exact preferences
      state = _.extend(state, {
        'criteriaOrder': Util.getCriteriaOrder(state.prefs),
        title: title(1, _.size(criteria) - 1),
      });
      state = _.extend(state, buildInitial(criteria, state.criteriaOrder[0], state.criteriaOrder[1], 1));
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      }, 100);
      return state;
    }

    function validChoice(state) {
      if (!state) {
        return false;
      }
      if (state.type === 'done') {
        return true;
      }
      var criteria = state.problem.criteria;
      return state.choice.lower !== PartialValueFunctionService.worst(criteria[state.criterionA]) &&
        state.choice.upper !== PartialValueFunctionService.worst(criteria[state.criterionA]);
    }

    function nextState(state) {
      if (!validChoice(state)) {
        return null;
      }
      var order = state.criteriaOrder;
      var criteria = state.problem.criteria;

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

      function getRatioBounds(state) {
        var u = PartialValueFunctionService.map(criteria[state.criterionA]);
        return [1 / u(state.choice.lower), 1 / u(state.choice.upper)].sort(function(a, b) {
          return a - b;
        });
      }

      next.prefs = angular.copy(state.prefs);
      next.prefs.push({
        criteria: [order[idx - 1], order[idx]],
        bounds: getRatioBounds(state),
        type: 'ratio bound'
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
        fields: ['total', 'choice', 'criteriaOrder', 'criterionA', 'criterionB'],
        nextState: nextState,
        standardize: _.identity,
        initialize: _.partial(initialize, taskDefinition.clean(currentScenario.state))
      }
    });
  };

});