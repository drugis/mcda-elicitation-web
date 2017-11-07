'use strict';
define(['lodash', 'angular'], function(_, angular) {

  var dependencies = [
    '$scope',
    '$modal',
    '$stateParams',
    '$state',
    'ScenarioResource',
    'PartialValueFunction',
    'TaskDependencies',
    'currentScenario'
  ];
  var PreferencesController = function(
    $scope,
    $modal,
    $stateParams,
    $state,
    ScenarioResource,
    PartialValueFunction,
    TaskDependencies,
    currentScenario) {

    // functions
    $scope.pvf = PartialValueFunction;
    $scope.isPVFDefined = isPVFDefined;
    $scope.isAccessible = isAccessible;
    $scope.editScenarioTitle = editScenarioTitle;

    // init
    $scope.scenario = currentScenario;
    $scope.scales = $scope.workspace.scales;
    $scope.criteria = $scope.aggregateState.criteria;
    $scope.getXY = _.memoize(PartialValueFunction.getXY, function(arg) {
      return angular.toJson(arg.pvf);
    });
    createIsSafeObject();

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
      $scope.isSafe = _.reduce($scope.tasks, function(obj, task) {
        obj[task.id] = isTaskSafe(task.id);
        return obj;
      }, {});
    }

    function isPVFDefined(criterion) {
      return criterion.pvf && criterion.pvf.type;
    }

    function isAccessible(task) {
      return TaskDependencies.isAccessible(task, $scope.aggregateState);
    }

    function editScenarioTitle() {
      $modal.open({
        templateUrl: '/app/js/preferences/editScenarioTitle.html',
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
              ScenarioResource.save($stateParams, $scope.scenario).$promise.then(function(){
                $state.reload();
              });
            };
          }
        }
      });
    }
  };
  return dependencies.concat(PreferencesController);
});