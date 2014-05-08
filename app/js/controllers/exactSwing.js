'use strict';
define(['mcda/controllers/helpers/wizard', 'mcda/controllers/helpers/util', 'angular', 'underscore'], function(Wizard, Util, angular, _) {

  return function($scope, $injector, mcdaRootPath, currentScenario, taskDefinition) {
    var criteria = {};

    function getBounds(criterionName) {
      var criterion = criteria[criterionName];
      return [criterion.worst(), criterion.best()].sort(function (a, b) { return a - b;});
    }

    function buildInitial(criterionA, criterionB, step) {
      var bounds = getBounds(criterionA);
      var increasing = criteria[criterionA].pvf.direction === 'increasing';
      return {
        step: step,
        total: _.size(criteria) - 1,
        criterionA: criterionA,
        criterionB: criterionB,
        choice: (bounds[0] + bounds[1]) / 2,
        range: { from: bounds[0], to: bounds[1], rightOpen: true }
      };
    }

    var initialize = function(state) {
      criteria = state.problem.criteria;
      state.prefs = Util.getOrdinalPreferences(state.prefs); // remove pre-existing ordinal/exact preferences
      state = _.extend(state, {'criteriaOrder' : Util.getCriteriaOrder(state.prefs)});
      state = _.extend(state, buildInitial(state.criteriaOrder[0], state.criteriaOrder[1], 1));
      return state;
    };

    var validChoice = function(state) {
      if (!state) return false;
      var value = state.choice;
      var bounds = getBounds(state.criterionA);
      return value < bounds[1] && value >= bounds[0];
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

      function getRatio(state) {
        var u = criteria[state.criterionA].pvf.map;
        return 1 / u(state.choice);
      }

      next.prefs = angular.copy(state.prefs);
      next.prefs.push(
        { criteria: [order[idx - 1], order[idx]],
          ratio: getRatio(state),
          type: "exact swing"});
      return _.extend(angular.copy(state), next);
    };

    $scope.rankProbabilityChartURL = mcdaRootPath + 'partials/rankProbabilityChart.html';

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
                 fields: ["problem", "prefs", "total", "choice", "criteriaOrder", "criterionA", "criterionB"],
                 nextState: nextState,
                 hasIntermediateResults: true,
                 standardize: _.identity,
                 initialize: _.partial(initialize, taskDefinition.clean(currentScenario.state))
               }
    });
  };
});
