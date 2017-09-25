'use strict';
define(['angular','lodash', 'mcda/controllers/helpers/wizard'],function(angular, _, Wizard) {
  var dependencies = [
    '$scope',
    '$state',
    '$stateParams',
    '$injector',
    'currentScenario',
    'taskDefinition',
    'PartialValueFunction',
    'TaskDependencies'
  ];

  var PartialValueFunctionController = function(
    $scope,
    $state,
    $stateParams,
    $injector,
    currentScenario,
    taskDefinition,
    PartialValueFunction,
    TaskDependencies) {
    // functions
    $scope.save = save;
    $scope.canSave = canSave;
    $scope.cancel = cancel;
    $scope.getXY = _.memoize(PartialValueFunction.getXY, function(arg) {
      return angular.toJson(arg.pvf);
    });

    // init
    $scope.pvf = PartialValueFunction;
    $scope.problem = $scope.aggregateState.problem;

    function initialize(state) {
      var criterionId = $stateParams.criterion;
      var criterion = _.cloneDeep($scope.problem.criteria[criterionId]);
      if (!criterion) {
        return {};
      }
      // set defaults
      criterion.pvf = !criterion.pvf ? {} : criterion.pvf;
      criterion.pvf.direction = 'decreasing';
      criterion.pvf.type = 'linear';
      criterion.pvf.cutoffs = undefined;
      criterion.pvf.values = undefined;

      var initial = {
        ref: 0,
        bisections: [
          [0, 1],
          [0, 0.5],
          [0.5, 1]
        ],
        type: 'elicit type',
        choice: criterion
      };

      return _.extend(state, initial);
    }

    function nextState(state) {
      var nextState = _.cloneDeep(state);
      var ref = nextState.ref;

      if (state.type === 'elicit type') {
        nextState.type = 'bisection';
      }

      if (nextState.type === 'bisection') {
        if (ref === 0) {
          nextState.choice.pvf.values = [];
          nextState.choice.pvf.cutoffs = [];
        }

        var bisection = nextState.bisections[ref];
        var inv = PartialValueFunction.inv(nextState.choice);

        var from, to;
        if (nextState.choice.direction === 'increasing') {
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
    }

    function standardizeCriterion(criterion) {
      var newCriterion = _.cloneDeep(criterion);
      if (newCriterion.pvf.type === 'linear') {
        newCriterion.pvf.values = undefined;
        newCriterion.pvf.cutoffs = undefined;
      }
      return newCriterion;
    }

    function save(state) {
      var criterionId = $stateParams.criterion;
      var standardizedCriterion = standardizeCriterion(state.choice);
      var criteria = _.cloneDeep(currentScenario.state.problem.criteria);
      criteria[criterionId] = standardizedCriterion;
      currentScenario.state.problem.criteria = criteria;

      currentScenario.state = TaskDependencies.remove(taskDefinition, currentScenario.state);
      currentScenario.$save($stateParams, function(scenario) {
        $scope.$emit('elicit.resultsAccessible', scenario);
        $state.go('preferences');
      });
    }

    function canSave(state) {
      switch (state.type) {
        case 'elicit type':
          return state.choice.pvf.type === 'linear';
        case 'bisection':
          return state.ref === state.bisections.length;
        default:
          return false;
      }
    }

    function isValid(state) {
      switch (state.type) {
        case 'elicit type':
          return state.choice.pvf.type && state.choice.pvf.direction;
        case 'bisection':
          return true;
        default:
          return false;
      }
    }

    function cancel() {
      $state.go('preferences');
    }

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: {
        fields: ['type', 'choice', 'bisections', 'ref'],
        validChoice: isValid,
        nextState: nextState,
        initialize: _.partial(initialize, taskDefinition.clean(currentScenario.state)),
        standardize: _.identity
      }
    });
  };
  return dependencies.concat(PartialValueFunctionController);
});