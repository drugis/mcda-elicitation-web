'use strict';
define(['lodash', 'clipboard'], function(_, Clipboard) {

  var dependencies = [
    '$scope',
    '$modal',
    '$stateParams',
    '$state',
    'ScenarioResource',
    'PartialValueFunctionService',
    'OrderingService',
    'PageTitleService',
    'PreferencesService',
    'TaskDependencies',
    'currentScenario'
  ];
  var PreferencesController = function(
    $scope,
    $modal,
    $stateParams,
    $state,
    ScenarioResource,
    PartialValueFunctionService,
    OrderingService,
    PageTitleService,
    PreferencesService,
    TaskDependencies,
    currentScenario
  ) {

    // functions
    $scope.isPVFDefined = isPVFDefined;
    $scope.isAccessible = isAccessible;
    $scope.editScenarioTitle = editScenarioTitle;

    // init
    $scope.pvf = PartialValueFunctionService;
    $scope.criteriaHavePvf = true;
    $scope.scenario = currentScenario;
    $scope.scales = $scope.workspace.scales;
    $scope.pvfCoordinates = {};
    $scope.scalesPromise.then(function() {
      reloadOrderings();
      $scope.pvfCoordinates = PartialValueFunctionService.getPvfCoordinates($scope.aggregateState.problem.criteria);
    });
    $scope.$on('elicit.settingsChanged', function() {
      reloadOrderings();
      $scope.pvfCoordinates = PartialValueFunctionService.getPvfCoordinates($scope.aggregateState.problem.criteria);
    });
    createIsSafeObject();
    $scope.criteriaHavePvf = doAllCriteriaHavePvf();
    reloadOrderings();

    new Clipboard('.clipboard-button');
    $scope.isOrdinal = _.find($scope.scenario.state.prefs, function(pref) {
      return pref.type === 'ordinal';
    });

    PageTitleService.setPageTitle('PreferencesController', ($scope.aggregateState.problem.title || $scope.workspace.title) + '\'s preferences');

    function reloadOrderings() {
      OrderingService.getOrderedCriteriaAndAlternatives($scope.aggregateState.problem, $stateParams).then(function(orderings) {
        $scope.alternatives = orderings.alternatives;
        $scope.criteria = _.map(orderings.criteria, setUnitOfMeasurement);
        $scope.importance = PreferencesService.buildImportance($scope.criteria, $scope.scenario.state.prefs);
      });
    }

    function setUnitOfMeasurement(criterion) {
      if (_.isEqual(criterion.dataSources[0].scale, [0, 1])) {
        criterion.unitOfMeasurement = '';
      } else if (_.isEqual(criterion.dataSources[0].scale, [0, 100])) {
        criterion.unitOfMeasurement = '%';
      }
      return criterion;
    }

    function isPVFDefined(dataSource) {
      return dataSource.pvf && dataSource.pvf.type;
    }

    function isAccessible(task) {
      return TaskDependencies.isAccessible(task, $scope.aggregateState);
    }

    function editScenarioTitle() {
      $modal.open({
        templateUrl: '../preferences/editScenarioTitle.html',
        controller: 'EditScenarioTitleController',
        resolve: {
          scenario: function() {
            return $scope.scenario;
          },
          scenarios: function() {
            return $scope.scenarios;
          },
          callback: function() {
            return function(newTitle) {
              $scope.scenario.title = newTitle;
              ScenarioResource.save($stateParams, $scope.scenario).$promise.then(function() {
                $state.reload();
              });
            };
          }
        }
      });
    }

    // private
    function doAllCriteriaHavePvf() {
      var havePvf = true;
      _.forEach($scope.aggregateState.problem.criteria, function(criterion) {
        if (!isPVFDefined(criterion.dataSources[0])) {
          havePvf = false;
        }
      });
      return havePvf;
    }

    function willReset(safe) {
      var resets = safe.resets.map(function(reset) {
        return TaskDependencies.definitions[reset].title;
      }).join(', ').replace(/,([^,]*)$/, ' & $1');

      return resets ? 'Saving this preference will reset: ' + resets : null;
    }

    function isTaskSafe(taskId) {
      var safe = TaskDependencies.isSafe($scope.tasks[taskId], $scope.aggregateState);
      safe.tooltip = willReset(safe);
      return safe;
    }

    function createIsSafeObject() {
      $scope.isSafe = _.reduce($scope.tasks, function(accum, task) {
        accum[task.id] = isTaskSafe(task.id);
        return accum;
      }, {});
    }

  };
  return dependencies.concat(PreferencesController);
});
