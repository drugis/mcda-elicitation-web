'use strict';
define(['angular', 'underscore', 'mcda/services/partialValueFunction'], function(angular, _) {

  return function($scope, PartialValueFunction, Tasks, TaskDependencies, currentScenario, taskDefinition) {
    var scenario = currentScenario;
    $scope.scenario = scenario;

    var state = taskDefinition.clean(scenario.state);
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

    $scope.dependenciesString = function(dependencies) {
      var result = "";
      _.each(dependencies, function(dep) {
        result = result + "\n- " + TaskDependencies.definitions[dep].title;
      });
      return result;
    };

    var linearPVFs = _.filter(problem.criteria, function(criterion) {
      return criterion.pvf && criterion.pvf.type === "linear";
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
    }, _.unique(_.pluck(state.prefs, "type"))));

    var scaleRange = _.every(problem.criteria, function(criterion) {
      return criterion.pvf && criterion.pvf.range;
    }) ? "defined" : "missing";

    $scope.status = {
      scaleRange: scaleRange,
      partialValueFunction: pvfStatus,
      preferences: prefStatus
    };

    $scope.problem = problem;

    $scope.criteria = _.sortBy(_.map(_.pairs(problem.criteria), function(crit, idx) {
      return _.extend(crit[1], { id: crit[0], w: "w_" + (idx + 1) });
    }), "w");

    var w = function(criterionKey) {
      return _.find($scope.criteria, function(crit) {return crit.id === criterionKey; })['w'];
    };

    var eqns = _.map(state.prefs, function(pref) {
      var crit = _.map(pref.criteria, w);
      if (pref.type === "ordinal") {
        return crit[0] + " & \\geq & " + crit[1] + "\\\\";
      } else if (pref.type === "ratio bound") {
        return "\\frac{" + crit[0] + "}{" + crit[1] + "} & \\in & [" + pref.bounds[0].toFixed(3) + ", " + pref.bounds[1].toFixed(3) + "] \\\\";
      } else if (pref.type === "exact swing") {
        return "\\frac{" + crit[0] + "}{" + crit[1] + "} & = & " + pref.ratio.toFixed(3) + " \\\\";
      } else {
        console.error("Unsupported preference type ", pref);
        return "";
      }
    });
    var eqnArray = "\\begin{eqnarray} " + _.reduce(eqns, function(memo, eqn) { return memo + eqn; }, "") + " \\end{eqnarray}";
    $scope.preferences = eqnArray;

    $scope.getXY = _.memoize(PartialValueFunction.getXY, function(arg) { return angular.toJson(arg.pvf); });

    $scope.isEditTitleVisible = false;
    
    $scope.editTitle = function() {
      $scope.isEditTitleVisible = true;
      $scope.scenarioTitleCache = $scope.scenario.title;
    };
    
    $scope.saveTitle = function() {
      $scope.scenario.title = $scope.scenarioTitleCache;
      $scope.scenario.save();
      $scope.isEditTitleVisible = false;
    };
    
    $scope.cancelTitle = function() {
      $scope.isEditTitleVisible = false;
    };
  };
});
