'use strict';
define(['lodash', '../controllers/wizard'], function (_, Wizard) {
  var dependencies = [
    '$scope',
    '$state',
    '$stateParams',
    'PartialValueFunctionService',
    'PageTitleService',
    'PreferencesService',
    'OrderingService',
    'WorkspaceSettingsService',
    'currentScenario'
  ];
  var OrdinalSwingController = function (
    $scope,
    $state,
    $stateParams,
    PartialValueFunctionService,
    PageTitleService,
    PreferencesService,
    OrderingService,
    WorkspaceSettingsService,
    currentScenario
  ) {
    //functions
    $scope.save = save;
    $scope.cancel = cancel;

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
      });
    }

    function save(prefs) {
      const newProblem = _.extend({}, $scope.problem, {
        preferences: prefs
      });
      PreferencesService.getWeights(newProblem).then((result) => {
        currentScenario.state = _.extend({}, currentScenario.state, {
          prefs: prefs,
          weights: result
        });
        currentScenario.$save($stateParams, function () {
          $scope.$emit('elicit.resultsAccessible', currentScenario);
          $state.go('preferences');
        });
      });
    }

    function cancel() {
      $state.go('preferences');
    }
  };
  return dependencies.concat(OrdinalSwingController);
});
