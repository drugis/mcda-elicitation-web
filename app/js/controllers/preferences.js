'use strict';
define(['mcda/config', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
  function(Config, angular, angularanimate, mmfoundation, _) {
    var dependencies = ['$scope', '$location', '$anchorScroll', 'PartialValueFunction', 'Tasks', 'TaskDependencies', 'intervalHull', 'taskDefinition', 'WorkspaceService'];
    var PreferencesController = function($scope, $location, $anchorScroll, PartialValueFunction, Tasks, TaskDependencies, intervalHull, taskDefinition, WorkspaceService)
    {
      var state = taskDefinition.clean($scope.scenario.state);

      $scope.$parent.taskId = taskDefinition.id;
      $scope.intervalHull = intervalHull;
      WorkspaceService.prepareScales($scope.workspace.problem).then(function(results) {
        $scope.scales = results.results;
      });


      var w = function(criterionKey) {
        return _.find($scope.criteria, function(crit) {
          return crit.id === criterionKey;
        }).w;
      };

      $scope.criteria = _.sortBy(_.map(_.pairs($scope.scenario.state.problem.criteria), function(crit, idx) {
        return _.extend(crit[1], {
          id: crit[0],
          w: 'w_' + (idx + 1)
        });
      }), 'w');

      var eqns = _.map(state.prefs, function(pref) {
        var crit = _.map(pref.criteria, w);
        if (pref.type === 'ordinal') {
          return crit[0] + ' & \\geq & ' + crit[1] + '\\\\';
        } else if (pref.type === 'ratio bound') {
          return '\\frac{' + crit[0] + '}{' + crit[1] + '} & \\in & [' + pref.bounds[0].toFixed(3) + ', ' + pref.bounds[1].toFixed(3) + '] \\\\';
        } else if (pref.type === 'exact swing') {
          return '\\frac{' + crit[0] + '}{' + crit[1] + '} & = & ' + pref.ratio.toFixed(3) + ' \\\\';
        } else {
          console.error('Unsupported preference type ', pref);
          return '';
        }
      });
      var eqnArray = '\\begin{eqnarray} ' + _.reduce(eqns, function(memo, eqn) {
        return memo + eqn;
      }, '') + ' \\end{eqnarray}';
      $scope.preferences = eqnArray;


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

    return dependencies.concat(PreferencesController);
  });
