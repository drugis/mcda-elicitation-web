'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return function($scope, $filter, $location, currentScenario, $anchorScroll, PartialValueFunction, Tasks, TaskDependencies, intervalHull, taskDefinition) {
    $scope.scenario = currentScenario;

    $scope.intervalHull = intervalHull;

    $scope.scales = $scope.workspace.$$scales;

    $scope.pvf = PartialValueFunction;

    $scope.criteria = _.sortBy(_.map(_.pairs(currentScenario.state.problem.criteria), function(crit, idx) {
      return _.extend(crit[1], {
        id: crit[0],
        w: 'w_' + (idx + 1)
      });
    }), 'w');

    var willReset = function(safe) {
      var resets = safe.resets.map(function(reset) {
        return TaskDependencies.definitions[reset].title;
      }).join(", ").replace(/,([^,]*)$/, ' & $1');

      return resets ? "Saving this preference will reset: " + resets : null;
    };

    var isSafe = function(taskId) {
      var safe = TaskDependencies.isSafe($scope.tasks[taskId], $scope.scenario.state);
      safe.tooltip = willReset(safe);
      return safe;
    };

    $scope.isSafe = _.reduce($scope.tasks, function(obj, task) {
      obj[task.id] = isSafe(task.id);
      return obj;
    }, {});

    $scope.isPVFDefined = function(criterion) {
      return criterion.pvf && criterion.pvf.type;
    };

    $scope.isAccessible = function(task, state) {
      return TaskDependencies.isAccessible(task, state);
    };

    $scope.isPartialValueFunctionAccessible = function() {
      return $scope.isAccessible($scope.tasks['partial-value-function'], $scope.scenario.state).accessible;
    };

    $scope.isOrdinalSwingAccessible = function() {
      return $scope.isAccessible($scope.tasks['ordinal-swing'], $scope.scenario.state).accessible;
    };

    $scope.isTradeoffRatiosAccessible = function() {
      return $scope.isAccessible($scope.tasks['exact-swing'], $scope.scenario.state).accessible;
    };

    $scope.isScaleRangePresent = function() {
      var isPresent = _.every($scope.scenario.state.problem.criteria, function(criterion) {
        return criterion.pvf && criterion.pvf.range;
      });
      return isPresent;
    };

    $scope.isPartialValueFunctionPresent = function() {
      return _.every($scope.scenario.state.problem.criteria, function(criterion) {
        var pvf = criterion.pvf;
        return pvf && pvf.direction && pvf.type;
      });
    };

    $scope.isOrdinalSwingPresent = function() {
      return $scope.scenario.state.prefs;
    };

    $scope.isExactSwingPresent = function() {
      return $scope.scenario.state.prefs && _.some($scope.scenario.state.prefs, function(pref) {
        return pref.type === 'exact swing';
      });
    };

    $scope.isIntervalSwingPresent = function() {
      return $scope.scenario.state.prefs && _.some($scope.scenario.state.prefs, function(pref) {
        return pref.type === 'ratio bound';
      });
    };

    $scope.isTradeoffRatiosPresent = function() {
      return $scope.isExactSwingPresent() || $scope.isIntervalSwingPresent();
    };

    $scope.scrollToScaleRanges = function() {
      $location.hash('scale-ranges-block');
      $anchorScroll();
    };

    $scope.scrollToPVFs = function(scrollEnabled) {
      if (scrollEnabled) {
        $location.hash('partial-value-functions-block');
        $anchorScroll();
      }
    };

    $scope.scrollToTradeOffs = function(scrollEnabled) {
      if (scrollEnabled) {
        $location.hash('trade-off-block');
        $anchorScroll();
      }
    };

    $scope.getXY = _.memoize(PartialValueFunction.getXY, function(arg) {
      return angular.toJson(arg.pvf);
    });

  };
});
