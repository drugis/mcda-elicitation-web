'use strict';
define(['controllers/helpers/wizard', 'controllers/helpers/util', 'angular', 'underscore'], function(Wizard, Util, angular, _) {

  return function($scope, $injector, currentScenario, taskDefinition) {
    var criteria = {};

    var getCriterion = function(criterionName) {
      return criteria[criterionName];
    };

    function getBounds(criterionName) {
      var criterion = getCriterion(criterionName);
      return [criterion.worst(), criterion.best()].sort();
    };

    function buildInitial(criterionA, criterionB, step) {
      var bounds = getBounds(criterionA);
      var increasing = criteria[criterionA].pvf.direction === 'increasing';
      return {
        step: step,
        total: _.size(criteria) - 1,
        criterionA: criterionA,
        criterionB: criterionB,
        best: function() { return increasing ? this.choice.upper : this.choice.lower; },
        worst: function() { return increasing ? this.choice.lower : this.choice.upper; },
        choice: {
          lower: bounds[0],
          upper: bounds[1]
        },
        range: { from: bounds[0], to: bounds[1], rightOpen: true }
      };
    };

    var initialize = function(state) {
      criteria = state.problem.criteria;
      state.prefs = Util.getOrdinalPreferences(state.prefs); // remove pre-existing ordinal/exact preferences
      state = _.extend(state, {'criteriaOrder' : Util.getCriteriaOrder(state.prefs)});
      state = _.extend(state, buildInitial(state.criteriaOrder[0], state.criteriaOrder[1], 1));
      return state;
    };


    var validChoice = function(state) {
      if(!state) return false;
      var choice = _.object(['lower', 'upper'], _.values(state.choice).sort());
      var other = getCriterion(state.criterionA);
      return choice.lower <= other.worst() && choice.upper >= other.best();
    };

    var nextState = function(state) {
      if(!validChoice(state)) return null;
      var order = state.criteriaOrder;

      var idx = _.indexOf(order, state.criterionB);
      var next;
      if(idx > order.length - 2) {
        next = {type: "done", step: idx + 1};
      } else {
        next = buildInitial(order[idx], order[idx + 1], idx + 1);
      }

      function getRatioBounds(state) {
        var u = criteria[state.criterionA].pvf.map;
        return [1 / u(state.choice.lower), 1 / u(state.choice.upper)].sort();
      }

      next.prefs = angular.copy(state.prefs);
      next.prefs.push(
        { criteria: [order[idx - 1], order[idx]],
          bounds: getRatioBounds(state),
          type: "ratio bound"});
      return _.extend(angular.copy(state), next);
    };

    $scope.canSave = function(state) {
      return state && state.step === state.total;
    };

    $scope.save = function(state) {
      state = nextState(state);
      currentScenario.update(state);
      currentScenario.redirectToDefaultView();
    };

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: { validChoice: validChoice,
                 fields: ["total", "choice", "criteriaOrder", "criterionA", "criterionB"],
                 nextState: nextState,
                 standardize: _.identity,
                 hasIntermediateResults: true,
                 initialize: _.partial(initialize, taskDefinition.clean(currentScenario.state))
               }
    });
  };

});
