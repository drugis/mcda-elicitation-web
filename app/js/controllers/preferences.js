'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("lodash");

  var dependencies = [
    '$scope',
    '$filter',
    '$anchorScroll',
    'sortCriteriaWithW',
    'PartialValueFunction',
    'Tasks',
    'TaskDependencies',
    'taskDefinition',
    'currentScenario'
  ];
  var PreferencesController = function(
    $scope,
    $filter,
    $anchorScroll,
    sortCriteriaWithW,
    PartialValueFunction,
    Tasks,
    TaskDependencies,
    taskDefinition,
    currentScenario) {
    // vars
    $scope.scenario = currentScenario;
    $scope.scales = $scope.workspace.$$scales;
    $scope.criteria = $scope.aggregateState.criteria;

    // functions
    $scope.pvf = PartialValueFunction;
    $scope.isPVFDefined = isPVFDefined;
    $scope.isAccessible = isAccessible;

    // init
    $scope.getXY = _.memoize(PartialValueFunction.getXY, function(arg) {
      return angular.toJson(arg.pvf);
    });
    createIsSafeObject();

    function willReset(safe) {
      var resets = safe.resets.map(function(reset) {
        return TaskDependencies.definitions[reset].title;
      }).join(", ").replace(/,([^,]*)$/, ' & $1');

      return resets ? "Saving this preference will reset: " + resets : null;
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

  };
  return dependencies.concat(PreferencesController);
});
