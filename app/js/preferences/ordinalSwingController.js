'use strict';
define(['lodash', '../controllers/wizard'], function (_, Wizard) {
  var dependencies = [
    '$scope',
    '$state',
    '$stateParams',
    '$injector',
    'PartialValueFunctionService',
    'PageTitleService',
    'PreferencesService',
    'OrderingService',
    'WorkspaceSettingsService',
    'currentScenario',
    'taskDefinition'
  ];
  var OrdinalSwingController = function (
    $scope,
    $state,
    $stateParams,
    $injector,
    PartialValueFunctionService,
    PageTitleService,
    PreferencesService,
    OrderingService,
    WorkspaceSettingsService,
    currentScenario,
    taskDefinition
  ) {
    //functions
    $scope.save = save;
    $scope.canSave = canSave;
    $scope.cancel = cancel;
    $scope.getUnitOfMeasurement =
      PartialValueFunctionService.getUnitOfMeasurement;

    //init
    $scope.pvf = PartialValueFunctionService;
    $scope.$on('elicit.settingsChanged', function () {
      resetWizard();
    });

    PageTitleService.setPageTitle('OrdinalSwingController', 'Ranking');
    $scope.scalesPromise.then(resetWizard);

    function resetWizard() {
      $scope.problem = WorkspaceSettingsService.usePercentage()
        ? $scope.aggregateState.percentified.problem
        : $scope.aggregateState.dePercentified.problem;
      OrderingService.getOrderedCriteriaAndAlternatives(
        $scope.problem,
        $stateParams
      ).then(function (orderings) {
        $scope.criteria = _.map(orderings.criteria, function (criterion) {
          criterion.best = PartialValueFunctionService.best(
            criterion.dataSources[0]
          );
          criterion.worst = PartialValueFunctionService.worst(
            criterion.dataSources[0]
          );
          return criterion;
        });
        $injector.invoke(
          Wizard,
          {},
          {
            $scope: $scope,
            handler: {
              validChoice: validChoice,
              fields: [
                'choice',
                'reference',
                'choices',
                'type',
                'standardized',
                'previousChoice'
              ],
              nextState: nextState,
              initialize: initialize,
              standardize: standardize
            }
          }
        );
      });
    }

    function save(state) {
      var nextState = standardize(state);
      const newProblem = _.extend({}, $scope.problem, {
        preferences: nextState.prefs
      });
      PreferencesService.getWeights(newProblem).then((result) => {
        currentScenario.state = _.extend({}, currentScenario.state, {
          prefs: nextState.prefs,
          weights: result
        });
        currentScenario.$save($stateParams, function () {
          $scope.$emit('elicit.resultsAccessible', currentScenario);
          $state.go('preferences');
        });
      });
    }

    function canSave(state) {
      return state && _.size(state.choices) === 2;
    }

    function cancel() {
      $state.go('preferences');
    }

    function title(step, total) {
      var base = 'Ranking';
      return base + ' (' + step + '/' + total + ')';
    }

    function initialize() {
      var state = taskDefinition.clean($scope.aggregateState);
      var fields = {
        title: title(1, _.size($scope.criteria) - 1),
        type: 'elicit',
        prefs: {
          ordinal: []
        },
        reference: _.cloneDeep($scope.criteria),
        choices: _.cloneDeep($scope.criteria)
      };
      return _.extend(state, fields);
    }

    function validChoice(state) {
      return state && _.includes(_.map($scope.criteria, 'id'), state.choice);
    }

    function nextState(state) {
      if (!validChoice(state)) {
        return null;
      }
      var choiceCriterion = _.find($scope.criteria, function (criterion) {
        return criterion.id === state.choice;
      });
      choiceCriterion.alreadyChosen = true;

      var nextState = _.cloneDeep(state);
      nextState.choice = undefined;
      nextState.choices = _.reject(nextState.choices, function (criterion) {
        return criterion.id === state.choice;
      });
      nextState.prefs.ordinal.push(state.choice);
      nextState.title = title(
        nextState.prefs.ordinal.length + 1,
        $scope.criteria.length - 1
      );

      return nextState;
    }

    function standardize(state) {
      var standardizedState = _.cloneDeep(state);
      var prefs = standardizedState.prefs;
      var order = prefs.ordinal;

      function ordinal(a, b) {
        return {
          type: 'ordinal',
          criteria: [a, b]
        };
      }

      if (order.length === $scope.criteria.length - 2) {
        order.push(state.choice);
      }
      var result = [];
      for (var i = 0; i < order.length - 1; i++) {
        result.push(ordinal(order[i], order[i + 1]));
      }
      if (order.length > 0) {
        var remaining = _.difference(
          _.map($scope.criteria, 'id'),
          order
        ).sort();
        result = result.concat(
          _.map(remaining, function (criterion) {
            return ordinal(_.last(order), criterion);
          })
        );
      }
      standardizedState.prefs = result;
      return standardizedState;
    }
  };
  return dependencies.concat(OrdinalSwingController);
});
