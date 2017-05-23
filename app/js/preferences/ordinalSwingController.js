'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('lodash');
  var Wizard = require('mcda/controllers/helpers/wizard');

  return function($scope, $state, $stateParams, $injector, currentScenario, taskDefinition, PartialValueFunction) {
    $scope.problem = $scope.aggregateState.problem;
    var pvf = PartialValueFunction;
    $scope.pvf = pvf;

    var getReference = function(criteria) {
      return _.zipObject(
        _.keys(criteria),
        _.map(criteria, function(criterion) {
          return pvf.worst(criterion);
        })
      );
    };

    var title = function(step, total) {
      var base = 'Ordinal SWING weighting';
      if (step > total) {
        return base + ' (DONE)';
      }
      return base + ' (' + step + '/' + total + ')';
    };

    function makeChoices() {
      var criteria = $scope.problem.criteria;
      var choices = _.map(_.keys(criteria), function(criterion) {
        var reference = getReference(criteria);
        reference[criterion] = pvf.best(criteria[criterion]);
        return reference;
      });
      return _.zipObject(_.keys(criteria), choices);
    }

    var initialize = function(state) {
      var criteria = $scope.problem.criteria;
      var fields = {
        title: title(1, _.size(criteria) - 1),
        type: 'elicit',
        prefs: {
          ordinal: []
        },
        reference: getReference(criteria),
        choices: makeChoices(state)
      };
      return _.extend(state, fields);
    };


    var validChoice = function(state) {
      var criteria = $scope.problem.criteria;
      return state && _.includes(_.keys(criteria), state.choice);
    };

    var nextState = function(state) {
      if (!validChoice(state)) {
        return null;
      }

      var nextState = angular.copy(state);
      var criteria = $scope.problem.criteria;

      var choice = state.choice;
      nextState.choice = undefined;

      _.each(nextState.choices, function(alternative) {
        alternative[choice] = pvf.best(criteria[choice]);
      });

      function next(choice) {
        delete nextState.choices[choice];
        nextState.reference[choice] = pvf.best($scope.problem.criteria[choice]);
        nextState.prefs.ordinal.push(choice);
        nextState.title = title(nextState.prefs.ordinal.length + 1, _.size(criteria) - 1);
      }
      next(choice);

      if (_.size(nextState.choices) === 1) {
        next(_.keys(nextState.choices)[0]);
        nextState.type = 'review';
      }

      return nextState;
    };

    function standardize(state) {
      var standardized = angular.copy(state);

      var criteria = $scope.problem.criteria;
      var prefs = standardized.prefs;
      var order = prefs.ordinal;

      function ordinal(a, b) {
        return {
          type: 'ordinal',
          criteria: [a, b]
        };
      }
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

      standardized.prefs = result;
      return standardized;
    }

    $scope.save = function(state) {
      var nextState = standardize(state);

      currentScenario.state = _.pick(nextState, ['problem', 'prefs']);
      currentScenario.$save($stateParams, function(scenario) {
        $scope.$emit('elicit.resultsAccessible', scenario);
        $state.go('preferences');
      });
    };

    $scope.canSave = function(state) {
      return state && _.size(state.choices) === 0;
    };

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: {
        validChoice: validChoice,
        fields: ['choice', 'reference', 'choices', 'type', 'standardized'],
        nextState: nextState,
        initialize: _.partial(initialize, taskDefinition.clean($scope.aggregateState)),
        standardize: standardize
      }
    });
  };
});
