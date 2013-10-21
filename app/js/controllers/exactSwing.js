define(['controllers/helpers/wizard', 'controllers/helpers/util', 'angular', 'underscore'], function(Wizard, Util, angular, _) {
  'use strict';

  var dependencies = ['$scope', '$injector', 'Workspaces'];

  var ExactSwingController = function($scope, $injector, Workspaces) {
    var criteria = {};

    function getBounds(criterionName) {
      var criterion = criteria[criterionName];
      return [criterion.worst(), criterion.best()].sort();
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
      state = _.extend(state, {'criteriaOrder' : Util.getCriteriaOrder(state.prefs)});
      state = _.extend(state, buildInitial(state.criteriaOrder[0], state.criteriaOrder[1], 1));
      return state;
    };

    Workspaces.current().then(function(workspace) {
      $scope.currentStep = initialize(workspace.state);
      $scope.workspace = workspace;
    });

    var validChoice = function(currentState) {
      if (!currentState) return false;
      var value = currentState.choice;
      var bounds = getBounds(currentState.criterionA);
      return value < bounds[1] && value >= bounds[0];
    };

    var nextState = function(currentState) {
      if(!validChoice(currentState)) return null;
      var order = currentState.criteriaOrder;

      var idx = _.indexOf(order, currentState.criterionB);
      var next;
      if(idx > order.length - 2) {
        next = {type: "done", step: idx + 1};
      } else {
        next = buildInitial(order[idx], order[idx + 1], idx + 1);
      }

      function getRatio(currentState) {
        var u = criteria[currentState.criterionA].pvf.map;
        return 1 / u(currentState.choice);
      }

      next.prefs = angular.copy(currentState.prefs);
      next.prefs.push(
        { criteria: [order[idx - 1], order[idx]],
          ratio: getRatio(currentState),
          type: "exact swing"});
      return _.extend(angular.copy(currentState), next);
    };

    $scope.canSave = function(state) {
      return state && state.step === state.total;
    };

    $scope.save = function(state) {
      state = nextState(state);
      $scope.workspace.save(state);
    };

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: { validChoice: validChoice,
                 fields: ["problem", "prefs", "total", "choice", "criteriaOrder", "criterionA", "criterionB"],
                 nextState: nextState }
    });
    $scope.$apply();
  };

  return dependencies.concat(ExactSwingController);
});
