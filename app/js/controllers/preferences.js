'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("lodash");

  var dependencies = [
    '$scope',
    '$filter',
    '$location',
    '$anchorScroll',
    'currentScenario',
    'PartialValueFunction',
    'Tasks',
    'TaskDependencies',
    'taskDefinition'
  ];
  var PreferencesController = function(
    $scope,
    $filter,
    $location,
    $anchorScroll,
    currentScenario,
    PartialValueFunction,
    Tasks,
    TaskDependencies,
    taskDefinition) {
    // vars
    $scope.scenario = currentScenario;
    $scope.scales = $scope.workspace.$$scales;
    $scope.criteria = _.sortBy(_.map(_.toPairs($scope.aggregateProblem.criteria), function(crit, idx) {
      return _.extend(crit[1], {
        id: crit[0],
        w: 'w_' + (idx + 1)
      });
    }), 'w');

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
      var safe = TaskDependencies.isSafe($scope.tasks[taskId], $scope.aggregateProblem);
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
