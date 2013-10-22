define(['angular', 'underscore', 'services/partialValueFunction'], function(angular, _) {
  'use strict';

  var dependencies = ['$scope', 'Workspaces', 'PartialValueFunction', 'Tasks', 'TaskDependencies'];
  var OverviewController =  function($scope, Workspaces, PartialValueFunction, Tasks, TaskDependencies) {
    Workspaces.current().then(function(workspace) {
      var state = workspace.state;
      var problem = state.problem;

      var tasks = _.map(Tasks.available, function(task) {
        return { 'task': task,
                 'accessible': TaskDependencies.isAccessible(task, state),
                 'safe': TaskDependencies.isSafe(task, state) }; });

      $scope.tasks = {
        'accessible' : _.filter(tasks, function(task) {
          return task.accessible.accessible && task.safe.safe; }),
        'destructive': _.filter(tasks, function(task) {
          return task.accessible.accessible && !task.safe.safe; }),
        'inaccessible': _.filter(tasks, function(task) {
          return !task.accessible.accessible; })
      };

      var linearPVFs = _.filter(problem.criteria, function(criterion) {
        return criterion.pvf.type === "linear";
      }).length;
      var pvfStatus = "linear";
      if (linearPVFs === 0) {
        pvfStatus = "piece-wise linear";
      } else if (linearPVFs < _.size(problem.criteria)) {
        pvfStatus = linearPVFs + " linear; " + (_.size(problem.criteria) - linearPVFs) + " piece-wise linear";
      }

      var prefStatus = _.values(_.pick({
        "ordinal": "Ordinal SWING",
        "ratio bound": "Interval SWING",
        "exact swing": "Exact SWING"
      }, _.unique(_.pluck(workspace.state.prefs, "type"))));

      var scaleRange = _.every(problem.criteria, function(criterion) {
        return criterion.pvf.range;
      }) ? "defined" : "missing";

      $scope.status = {
        scaleRange: scaleRange,
        partialValueFunction: pvfStatus,
        preferences: prefStatus
      };

      $scope.problem = problem;

      $scope.criteria = _.pluck(problem.criteria, "title").sort();
      var w = function(criterionKey) {
        var criterionIndex = _.indexOf($scope.criteria, problem.criteria[criterionKey].title) + 1;
        return "w_" + criterionIndex;
      };

      var eqns = _.map(workspace.state.prefs, function(pref) {
        var crit = _.map(pref.criteria, w);
        if (pref.type === "ordinal") {
          return crit[0] + " & \\geq & " + crit[1] + "\\\\";
        } else if (pref.type === "ratio bound") {
          return "\\frac{" + crit[0] + "}{" + crit[1] + "} & \\in & [" + pref.bounds[0] + ", " + pref.bounds[1] + "] \\\\";
        } else if (pref.type === "exact swing") {
          return "\\frac{" + crit[0] + "}{" + crit[1] + "} & = & " + pref.ratio + " \\\\";
        } else {
          console.error("Unsupported preference type ", pref);
          return "";
        }
      });
      var eqnArray = "\\begin{eqnarray} " + _.reduce(eqns, function(memo, eqn) { return memo + eqn; }, "") + " \\end{eqnarray}";
      $scope.preferences = eqnArray;

      $scope.getXY = _.memoize(PartialValueFunction.getXY, function(arg) { return arg.title.hashCode(); });

    });

    $scope.$apply();
  };

  return dependencies.concat(OverviewController);
});
