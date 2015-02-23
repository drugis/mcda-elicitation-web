'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");
  var Wizard = require("mcda/controllers/helpers/wizard");

  return function($scope, $state, $stateParams, $injector, currentScenario, taskDefinition, PartialValueFunction) {
    $scope.pvf = PartialValueFunction;

    var scenario = currentScenario;
    var criterionId = $stateParams.criterion;


    var initialize = function(state) {
      var criterion = angular.copy(scenario.state.problem.criteria[criterionId]);
      // set defaults
      criterion.pvf.direction = "decreasing";
      criterion.pvf.type = "linear";

      var initial = {
        ref: 0,
        bisections: [[0,1], [0,0.5], [0.5,1]],
        type: 'elicit type',
        choice: criterion
      };

      return _.extend(state, initial);
    };

    var nextState = function(state) {
      var nextState = angular.copy(state);
      var ref = nextState.ref;

      if(state.type === 'elicit type') {
        nextState.type = "bisection";
      }

      if(nextState.type === "bisection") {
        if(ref === 0) {
          nextState.choice.pvf.values = [];
          nextState.choice.pvf.cutoffs = [];
        }

        var bisection = nextState.bisections[ref];
        var inv = PartialValueFunction.inv(nextState.choice);

        var from, to;
        if(nextState.choice.direction === "increasing") {
          from = inv(bisection[1]);
          to = inv(bisection[0]);
        } else {
          from = inv(bisection[0]);
          to = inv(bisection[1]);
        }

        nextState.choice.pvf.values[ref] = (bisection[0] + bisection[1]) / 2;
        nextState.choice.pvf.cutoffs[ref] = (to + from) / 2;

        nextState = _.extend(nextState, {
          ref: ref + 1,
          range: {
            from: from,
            to: to
          }
        });
      }

      return nextState;
    };

    var sortByValues = function(criterion) {
      /* sorts the values and cutoffs according to the values (y-axis)
       returns an object containing the values and cuttoffs */
      var newCutoffs = criterion.pvf.cutoffs.slice();
      var newValues = criterion.pvf.values.slice();

      var list = [];
      for (var j = 0; j < newCutoffs.length; j++) {
        list.push({'cutoff': newCutoffs[j], 'value': newValues[j]});
      }
      list.sort(function(a,b) {
        return ((b.value < a.value) ? - 1 : ((b.value === a.value) ? 0 : 1));
      });

      for (var k = 0; k < list.length; k++) {
        newCutoffs[k] = list[k].cutoff;
        newValues[k] = list[k].value;
      }

      return {
        values: newValues,
        cutoffs: newCutoffs
      };
    };

    var standardizeCriterion = function(criterion) {
      var newCriterion = angular.copy(criterion);
      if (newCriterion.pvf.type === 'linear') {
        newCriterion.pvf.values = undefined;
        newCriterion.pvf.cutoffs = undefined;
      } else {
        if(newCriterion.pvf.cutoffs && newCriterion.pvf.values) {
          newCriterion.pvf = _.extend(newCriterion.pvf, sortByValues(newCriterion));
        }
      }
      return newCriterion;
    };

    $scope.save = function(state) {
      state.problem.criteria[criterionId] = standardizeCriterion(state.choice);

      $scope.scenario.state = _.pick(state, ['problem', 'prefs']);

      $scope.scenario.$save($stateParams, function() {
        $scope.$emit('elicit.partialValueFunctionChanged');
        $state.go('preferences');
      });
    };

    $scope.canSave = function(state) {
      switch(state.type) {
      case 'elicit type':
        return state.choice.pvf.type === "linear";
      case 'bisection':
        return state.ref === state.bisections.length;
      default:
        return false;
      }
    };

    var isValid = function(state) {
      switch(state.type) {
      case 'elicit type':
        return state.choice.pvf.type  && state.choice.pvf.type;
      case 'bisection':
        return true;
      default:
        return false;
      }
    };

    $scope.getXY = _.memoize(function(criterion) {
      return PartialValueFunction.getXY(standardizeCriterion(criterion));
    }, function(criterion) { // hash
      return angular.toJson(standardizeCriterion(criterion).pvf);
    });

    $scope.cancel = function() {
      $state.go('preferences');
    };

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: {
        fields: ['type', 'choice','bisections', 'ref'],
        validChoice: isValid,
        hasIntermediateResults: false,
        nextState: nextState,
        initialize: _.partial(initialize, taskDefinition.clean($scope.scenario.state)),
        standardize: _.identity
      }
    });
  };
});
