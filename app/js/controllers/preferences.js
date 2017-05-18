'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("lodash");

  var dependencies = [
    '$scope',
    '$filter',
    '$location',
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
    $location,
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

    $scope.getXY = _.memoize(PartialValueFunction.getXY, function(arg) {
      return angular.toJson(arg.pvf);
    });

    function willReset(safe) {
      var resets = safe.resets.map(function(reset) {
        return TaskDependencies.definitions[reset].title;
      }).join(", ").replace(/,([^,]*)$/, ' & $1');

      return resets ? "Saving this preference will reset: " + resets : null;
    }

    function isSafe(taskId) {
      var safe = TaskDependencies.isSafe($scope.tasks[taskId], $scope.aggregateState.problem);
      safe.tooltip = willReset(safe);
      return safe;
    }

    $scope.isSafe = _.reduce($scope.tasks, function(obj, task) {
      obj[task.id] = isSafe(task.id);
      return obj;
    }, {});

    function isPVFDefined(criterion) {
      return criterion.pvf && criterion.pvf.type;
    }

    function isAccessible(task, state) {
      return TaskDependencies.isAccessible(task, state);
    }

  };
  return dependencies.concat(PreferencesController);
});
