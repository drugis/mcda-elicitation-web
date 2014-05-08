'use strict';
define(['mcda/controllers/helpers/wizard', 'angular', 'underscore'], function(Wizard, angular, _) {
  return function($scope, $injector, mcdaRootPath, currentScenario, taskDefinition) {
    var criteria = {};

    var getReference = function() {
      return _.object(
        _.keys(criteria),
        _.map(criteria, function(criterion) { return criterion.worst(); })
      );
    };

    var title = function(step) {
      var base = 'Ordinal SWING weighting';
      var total = (_.size(criteria) - 1);
      if(step > total) {
        return base + ' (DONE)';
      }
      return base + ' (' + step + '/' + total + ')';
    };


    var initialize = function(state) {
      criteria = state.problem.criteria;
      var fields = {
        title: title(1),
        prefs: { ordinal: [] },
        reference: getReference(),
        choices: (function() {
          var criteria = state.problem.criteria;
          var choices = _.map(_.keys(criteria), function(criterion) {
            var reference = getReference();
            reference[criterion] = criteria[criterion].best();
            return reference;
          });
          return _.object(_.keys(criteria), choices);
        })()
      };
      return _.extend(state, fields);
    };

    var scenario = currentScenario;

    var validChoice = function(state) {
      return state && _.contains(_.keys(criteria), state.choice);
    };

    var nextState = function(state) {
      if(!validChoice(state)) {
        return null;
      }

      var nextState = angular.copy(state);
      var choice = state.choice;
      nextState.choice = undefined;

      _.each(nextState.choices, function(alternative) {
        alternative[choice] = criteria[choice].best();
      });

      function next(choice) {
        delete nextState.choices[choice];
        nextState.reference[choice] = state.problem.criteria[choice].best();
        nextState.prefs.ordinal.push(choice);
        nextState.title = title(nextState.prefs.ordinal.length + 1);
      }
      next(choice);

      if(_.size(nextState.choices) === 1) {
        next(_.keys(nextState.choices)[0]);
      }
      return nextState;
    };

    var standardize = function(prefs) {
      var order = prefs.ordinal;
      function ordinal(a, b) { return { type: 'ordinal', criteria: [a, b] }; }
      var result = [];
      for (var i = 0; i < order.length - 1; i++) {
        result.push(ordinal(order[i], order[i + 1]));
      }
      if (order.length > 0) {
        var remaining = _.difference(_.keys(criteria), order).sort();
        result = result.concat(_.map(remaining, function(criterion) {
          return ordinal(_.last(order), criterion);
        }));
      }
      return result;
    };

    $scope.rankProbabilityChartURL = mcdaRootPath + 'partials/rankProbabilityChart.html';

    $scope.standardize = standardize;

    $scope.save = function(state) {
      var next = nextState(state);
      var prefs = next.prefs;
      next.prefs = standardize(prefs);
      scenario.update(next);
      scenario.redirectToDefaultView();
    };

    $scope.canSave = function(state) {
      return state && _.size(state.choices) === 2;
    };

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: { validChoice: validChoice,
                 fields: ['choice', 'reference', 'choices'],
                 nextState: nextState,
                 initialize: _.partial(initialize, taskDefinition.clean(scenario.state)),
                 hasIntermediateResults: true,
                 standardize: standardize }
    });
  };

});
