'use strict';
define(['mcda/config', 'mcda/lib/patavi', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
  function(Config, patavi, angular, angularanimate, mmfoundation, _) {
    var dependencies = ['$scope', 'PartialValueFunction', 'Tasks', 'TaskDependencies', 'intervalHull', 'currentScenario', 'taskDefinition'];
    var PreferencesController = function($scope, PartialValueFunction, Tasks, TaskDependencies, intervalHull, currentScenario, taskDefinition, Remarks) {
      var state,
      scenario = currentScenario;

      $scope.$parent.taskId = taskDefinition.id;
      $scope.intervalHull = intervalHull;
      $scope.scenario = scenario;
      state = taskDefinition.clean(scenario.state);

      $scope.progress = {
        percentageComplete: 50
      };
 

      // FIXME: these calculations really should happen at the workspace level
      // ===========================================
      (function(problem) {
        var errorHandler = function(code, error) {
          var message = {
            code: (code && code.desc) ? code.desc : code,
            cause: error
          };
          $scope.$root.$broadcast('error', message);
        };
        var data = _.extend(problem, {
          'method': 'scales'
        });
        var task = patavi.submit(Config.pataviService, data);
        $scope.scales = {};
        task.results.then(function(data) {
          $scope.$apply(function() {
            $scope.scales = data.results;
          });
        }, errorHandler);
      })($scope.workspace.problem);
      // ===========================================

      var tasks = _.map(Tasks.available, function(task) {
        return {
          'task': task,
          'accessible': TaskDependencies.isAccessible(task, state),
          'safe': TaskDependencies.isSafe(task, state)
        };
      });

      $scope.tasks = {
        'accessible': _.filter(tasks, function(task) {
          return task.accessible.accessible && task.safe.safe;
        }),
        'destructive': _.filter(tasks, function(task) {
          return task.accessible.accessible && !task.safe.safe;
        }),
        'inaccessible': _.filter(tasks, function(task) {
          return !task.accessible.accessible;
        })
      };

      $scope.dependenciesString = function(dependencies) {
        var result = '';
        _.each(dependencies, function(dep) {
          result = result + '\n- ' + TaskDependencies.definitions[dep].title;
        });
        return result;
      };

      var linearPVFs = _.filter(scenario.state.problem.criteria, function(criterion) {
        return criterion.pvf && criterion.pvf.type === 'linear';
      }).length;
      var pvfStatus = 'linear';

      if (linearPVFs === 0) {
        pvfStatus = 'piece-wise linear';
      } else if (linearPVFs < _.size(scenario.state.problem.criteria)) {
        pvfStatus = linearPVFs + ' linear; ' + (_.size(scenario.state.problem.criteria) - linearPVFs) + ' piece-wise linear';
      }

      var prefStatus = _.values(_.pick({
        'ordinal': 'Ordinal SWING',
        'ratio bound': 'Interval SWING',
        'exact swing': 'Exact SWING'
      }, _.unique(_.pluck(state.prefs, 'type'))));

      var scaleRange = _.every(scenario.state.problem.criteria, function(criterion) {
        return criterion.pvf && criterion.pvf.range;
      }) ? 'defined' : 'missing';

      $scope.status = {
        scaleRange: scaleRange,
        partialValueFunction: pvfStatus,
        preferences: prefStatus
      };

      $scope.problem = $scope.workspace.problem;

      $scope.criteria = _.sortBy(_.map(_.pairs(scenario.state.problem.criteria), function(crit, idx) {
        return _.extend(crit[1], {
          id: crit[0],
          w: 'w_' + (idx + 1)
        });
      }), 'w');

      var w = function(criterionKey) {
        return _.find($scope.criteria, function(crit) {
          return crit.id === criterionKey;
        }).w;
      };

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

      $scope.getXY = _.memoize(PartialValueFunction.getXY, function(arg) {
        return angular.toJson(arg.pvf);
      });
    };

    return dependencies.concat(PreferencesController);
  });