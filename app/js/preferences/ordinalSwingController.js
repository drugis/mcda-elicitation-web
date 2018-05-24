'use strict';
define(['lodash', 'mcda/controllers/helpers/wizard'], function(_, Wizard) {
  var dependencies = [
    '$scope', '$state', '$stateParams', '$injector',
    'PartialValueFunctionService',
    'OrderingService',
    'currentScenario',
    'taskDefinition'
  ];
  var OrdinalSwingController = function($scope, $state, $stateParams, $injector,
    PartialValueFunctionService,
    OrderingService,
    currentScenario,
    taskDefinition
  ) {
    //functions 
    $scope.save = save;
    $scope.canSave = canSave;
    $scope.cancel = cancel;

    //init
    $scope.problem = $scope.aggregateState.problem;
    $scope.pvf = PartialValueFunctionService;

    function getReference(criteria) {
      return _.zipObject(
        _.map(criteria, 'id'),
        _.map(criteria, function(criterion) {
          return PartialValueFunctionService.worst(criterion);
        })
      );
    }

    function title(step, total) {
      var base = 'Ranking';
      return base + ' (' + step + '/' + total + ')';
    }

    function makeChoices() {
      var criteria = $scope.criteria;
      var choices = _.map(criteria, function(criterion) {
        var reference = getReference(criteria);
        reference[criterion.id] = PartialValueFunctionService.best(criterion);
        return reference;
      });
      return _.zipObject(_.map(criteria, 'id'), choices);
    }

    function initialize(state) {
      var fields = {
        title: title(1, _.size($scope.criteria) - 1),
        type: 'elicit',
        prefs: {
          ordinal: []
        },
        reference: getReference($scope.criteria),
        choices: makeChoices()
      };
      return _.extend(state, fields);
    }

    function validChoice(state) {
      var criteria = $scope.problem.criteria;
      return state && _.includes(_.keys(criteria), state.choice);
    }

    function nextState(state) {
      if (!validChoice(state)) {
        return null;
      }

      var nextState = _.cloneDeep(state);
      var criteria = $scope.problem.criteria;

      var choice = state.choice;
      nextState.choice = undefined;

      _.each(nextState.choices, function(alternative) {
        alternative[choice] = PartialValueFunctionService.best(criteria[choice]);
      });

      function next(choice) {
        delete nextState.choices[choice];
        nextState.reference[choice] = PartialValueFunctionService.best($scope.problem.criteria[choice]);
        nextState.prefs.ordinal.push(choice);
        nextState.title = title(nextState.prefs.ordinal.length + 1, _.size(criteria) - 1);
      }
      next(choice);

      if (_.size(nextState.choices) === 1) {
        next(_.keys(nextState.choices)[0]);
        nextState.type = 'review';
      }

      return nextState;
    }

    function standardize(state) {
      var standardized = _.cloneDeep(state);

      var criteria = $scope.problem.criteria;
      var prefs = standardized.prefs;
      var order = prefs.ordinal;

      function ordinal(a, b) {
        return {
          type: 'ordinal',
          criteria: [a, b]
        };
      }
      if (order.length === _.size(criteria) - 2) {
        order.push(state.choice);
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

    function save(state) {
      var nextState = standardize(state);

      currentScenario.state = _.pick(nextState, ['problem', 'prefs']);
      currentScenario.$save($stateParams, function(scenario) {
        $scope.$emit('elicit.resultsAccessible', scenario);
        $state.go('preferences');
      });
    }

    function canSave(state) {
      return state && _.size(state.choices) === 2;
    }

    function cancel() {
      $state.go('preferences');
    }

    OrderingService.getOrderedCriteriaAndAlternatives($scope.aggregateState.problem, $stateParams).then(function(orderings) {
      $scope.alternatives = orderings.alternatives;
      $scope.criteria = orderings.criteria;
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
    });
  };
  return dependencies.concat(OrdinalSwingController);
});
