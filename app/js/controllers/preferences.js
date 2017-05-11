'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("lodash");

  return function($scope, $filter, $location, currentScenario, $anchorScroll, PartialValueFunction, Tasks, TaskDependencies, intervalHull, taskDefinition) {
    // vars
    $scope.scenario = currentScenario;
    $scope.scales = $scope.workspace.$$scales;
    $scope.criteria = _.sortBy(_.map(_.toPairs(currentScenario.state.problem.criteria), function(crit, idx) {
      return _.extend(crit[1], {
        id: crit[0],
        w: 'w_' + (idx + 1)
      });
    }), 'w');

    // functions
    $scope.pvf = PartialValueFunction;
    $scope.intervalHull = intervalHull;
    $scope.isPVFDefined = isPVFDefined;
    $scope.isAccessible = isAccessible;
    $scope.isPartialValueFunctionAccessible = isPartialValueFunctionAccessible;
    $scope.isOrdinalSwingAccessible = isOrdinalSwingAccessible;
    $scope.isTradeoffRatiosAccessible = isTradeoffRatiosAccessible;
    $scope.isScaleRangePresent = isScaleRangePresent;
    $scope.isTradeoffRatiosPresent = isTradeoffRatiosPresent;
    $scope.isIntervalSwingPresent = isIntervalSwingPresent;
    $scope.isExactSwingPresent = isExactSwingPresent;
    $scope.isOrdinalSwingPresent = isOrdinalSwingPresent;
    $scope.isPartialValueFunctionPresent = isPartialValueFunctionPresent;
    $scope.scrollToTradeOffs = scrollToTradeOffs;
    $scope.scrollToPVFs = scrollToPVFs;
    $scope.scrollToScaleRanges = scrollToScaleRanges;

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
      var safe = TaskDependencies.isSafe($scope.tasks[taskId], $scope.scenario.state);
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

    function isPartialValueFunctionAccessible() {
      return $scope.isAccessible($scope.tasks['partial-value-function'], $scope.scenario.state).accessible;
    }

    function isOrdinalSwingAccessible() {
      return $scope.isAccessible($scope.tasks['ordinal-swing'], $scope.scenario.state).accessible;
    }

    function isTradeoffRatiosAccessible() {
      return $scope.isAccessible($scope.tasks['exact-swing'], $scope.scenario.state).accessible;
    }

    function isScaleRangePresent() {
      var isPresent = _.every($scope.scenario.state.problem.criteria, function(criterion) {
        return criterion.pvf && criterion.pvf.range;
      });
      return isPresent;
    }

    function isPartialValueFunctionPresent() {
      return _.every($scope.scenario.state.problem.criteria, function(criterion) {
        var pvf = criterion.pvf;
        return pvf && pvf.direction && pvf.type;
      });
    }

    function isOrdinalSwingPresent() {
      return $scope.scenario.state.prefs;
    }


    function isExactSwingPresent() {
      return $scope.scenario.state.prefs && _.some($scope.scenario.state.prefs, function(pref) {
        return pref.type === 'exact swing';
      });
    }

    function isIntervalSwingPresent() {
      return $scope.scenario.state.prefs && _.some($scope.scenario.state.prefs, function(pref) {
        return pref.type === 'ratio bound';
      });
    }

    function isTradeoffRatiosPresent() {
      return $scope.isExactSwingPresent() || $scope.isIntervalSwingPresent();
    }

    function scrollToScaleRanges() {
      $location.hash('scale-ranges-block');
      $anchorScroll();
    }


    function scrollToPVFs(scrollEnabled) {
      if (scrollEnabled) {
        $location.hash('partial-value-functions-block');
        $anchorScroll();
      }
    }

    function scrollToTradeOffs(scrollEnabled) {
      if (scrollEnabled) {
        $location.hash('trade-off-block');
        $anchorScroll();
      }
    }

  };
});
