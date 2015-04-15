'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");
  var Wizard = require("mcda/controllers/helpers/wizard");

  return function($scope, $state, $stateParams, $injector, currentScenario, taskDefinition, PartialValueFunction) {
    var criteria = {};
    var pvf = PartialValueFunction;
    var scenario = currentScenario;

    $scope.pvf = pvf;

    var getReference = function() {
      return _.object(
        _.keys(criteria),
        _.map(criteria, function(criterion) {
          return pvf.worst(criterion);
        })
      );
    };

    var title = function(step) {
      var base = 'Ordinal SWING weighting';
      var total = (_.size(criteria) - 1);
      if (step > total) {
        return base + ' (DONE)';
      }
      return base + ' (' + step + '/' + total + ')';
    };

    var initialize = function(state) {
      criteria = state.problem.criteria;
      var fields = {
        title: title(1),
        type: 'elicit',
        prefs: {
          ordinal: []
        },
        reference: getReference(),
        choices: (function() {
          var criteria = state.problem.criteria;
          var choices = _.map(_.keys(criteria), function(criterion) {
            var reference = getReference();
            reference[criterion] = pvf.best(criteria[criterion]);
            return reference;
          });
          return _.object(_.keys(criteria), choices);
        })()
      };
      return _.extend(state, fields);
    };


    var validChoice = function(state) {
      return state && _.contains(_.keys(criteria), state.choice);
    };

    var nextState = function(state) {
      if (!validChoice(state)) {
        return null;
      }

      var nextState = angular.copy(state);
      var choice = state.choice;
      nextState.choice = undefined;

      _.each(nextState.choices, function(alternative) {
        alternative[choice] = pvf.best(criteria[choice]);
      });

      function next(choice) {
        delete nextState.choices[choice];
        nextState.reference[choice] = pvf.best(state.problem.criteria[choice]);
        nextState.prefs.ordinal.push(choice);
        nextState.title = title(nextState.prefs.ordinal.length + 1);
      }
      next(choice);

      if (_.size(nextState.choices) === 1) {
        next(_.keys(nextState.choices)[0]);
        nextState.type = 'review';
      }

      return nextState;
    };

    function standardize(prefs) {
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
      return result;
    }

    $scope.save = function(state) {
      state.prefs = standardize(state.prefs);

      $scope.scenario.state = _.pick(state, ['problem', 'prefs']);
      $scope.scenario.$save($stateParams, function(scenario) {
        $state.go('preferences', {}, { reload: true });
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
        initialize: _.partial(initialize, taskDefinition.clean(scenario.state)),
        standardize: standardize
      }
    });
  };
});
