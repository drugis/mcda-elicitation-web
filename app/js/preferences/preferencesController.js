'use strict';
define([
  'lodash',
  'clipboard',
  'jquery'
], function(
  _,
  Clipboard,
  $) {

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
    'WorkspaceSettingsService'
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
    WorkspaceSettingsService
  ) {

    // functions
    $scope.isPVFDefined = isPVFDefined;
    $scope.isAccessible = isAccessible;
    $scope.editScenarioTitle = editScenarioTitle;
    $scope.resetWeights = resetWeights;

    // init
    $scope.pvf = PartialValueFunctionService;
    $scope.criteriaHavePvf = true;
    $scope.scales = $scope.workspace.scales;
    $scope.pvfCoordinates = {};
    $scope.scalesPromise.then(resetPvfCoordinates);
    $scope.$on('elicit.settingsChanged', resetPvfCoordinates);

    createIsSafeObject();
    $scope.criteriaHavePvf = doAllCriteriaHavePvf();

    new Clipboard('.clipboard-button');
    $scope.isOrdinal = _.some($scope.scenario.state.prefs, function(pref) {
      return pref.type === 'ordinal';
    });

    PageTitleService.setPageTitle('PreferencesController', ($scope.aggregateState.problem.title || $scope.workspace.title) + '\'s preferences');

    function resetWeights() {
      $scope.scenario.state.prefs = [];
      $scope.importance = PreferencesService.buildImportance($scope.criteria, $scope.scenario.state.prefs);
      $scope.scenario.$save($stateParams, function() {
        $scope.$emit('elicit.resultsAccessible');
        $scope.problem = WorkspaceSettingsService.usePercentage() ? $scope.aggregateState.percentified.problem : $scope.aggregateState.dePercentified.problem;
        createIsSafeObject();
        $('div.tooltip:visible').hide();
        $('#resetWeightsButton').removeClass('open');
      });
    }

    function resetPvfCoordinates() {
      $scope.problem = WorkspaceSettingsService.usePercentage() ? $scope.aggregateState.percentified.problem : $scope.aggregateState.dePercentified.problem;
      reloadOrderings();
      $scope.pvfCoordinates = PartialValueFunctionService.getPvfCoordinates($scope.problem.criteria);
    }

    function reloadOrderings() {
      OrderingService.getOrderedCriteriaAndAlternatives($scope.problem, $stateParams).then(function(orderings) {
        $scope.alternatives = orderings.alternatives;
        $scope.criteria = orderings.criteria;
        var preferences = $scope.scenario.state.prefs;
        $scope.importance = PreferencesService.buildImportance($scope.criteria, preferences);
      });
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
      return !_.find($scope.aggregateState.problem.criteria, function(criterion) {
        return !isPVFDefined(criterion.dataSources[0]);
      });
    }

    function willReset(safe) {
      var resets = safe.resets.map(function(reset) {
        return TaskDependencies.definitions[reset].title;
      }).join(', ').replace(/,([^,]*)$/, ' & $1');

      return resets ? 'Saving this preference will reset: ' + resets : null;
    }

    function createIsSafeObject() {
      $scope.isSafe = _.reduce($scope.tasks, function(accum, task) {
        accum[task.id] = isTaskSafe(task.id);
        return accum;
      }, {});
    }

    function isTaskSafe(taskId) {
      var safe = TaskDependencies.isSafe($scope.tasks[taskId], $scope.aggregateState);
      safe.tooltip = willReset(safe);
      return safe;
    }

  };
  return dependencies.concat(PreferencesController);
});
