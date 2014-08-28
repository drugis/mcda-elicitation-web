'use strict';
define(['mcda/config', 'mcda/lib/patavi', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
    function (Config, patavi, angular, angularanimate, mmfoundation, _) {
      var dependencies = ['$scope', 'PartialValueFunction', 'Tasks', 'TaskDependencies', 'intervalHull', 'currentScenario', 'taskDefinition', config.remarksRepository.service];
      var OverviewController = function ($scope, PartialValueFunction, Tasks, TaskDependencies, intervalHull, currentScenario, taskDefinition, Remarks) {

        $scope.intervalHull = intervalHull;

        Remarks.get($scope.workspace.id).then(function (remarks) {
          $scope.remarks = remarks;
        });

        $scope.saveRemarks = function () {
          Remarks.save($scope.workspace.id, $scope.remarks);
        };

        var scenario = currentScenario;
        $scope.scenario = scenario;

        $scope.$parent.taskId = taskDefinition.id;

        var state = taskDefinition.clean(scenario.state);
        var problem = state.problem;

        var errorHandler = function (code, error) {
          var message = {
            code: (code && code.desc) ? code.desc : code,
            cause: error
          };
          $scope.$root.$broadcast("error", message);
          NProgress.done();
        };

        var data = _.extend(problem, { "method": "scales" });
        var task = patavi.submit(Config.pataviService, data);
        $scope.scales = {};
        task.results.then(function (data) {
          $scope.$apply(function () { $scope.scales = data.results });
        }, errorHandler);

        var tasks = _.map(Tasks.available, function (task) {
          return {
            'task': task,
            'accessible': TaskDependencies.isAccessible(task, state),
            'safe': TaskDependencies.isSafe(task, state)
          };
        });

        $scope.tasks = {
          'accessible': _.filter(tasks, function (task) {
            return task.accessible.accessible && task.safe.safe;
          }),
          'destructive': _.filter(tasks, function (task) {
            return task.accessible.accessible && !task.safe.safe;
          }),
          'inaccessible': _.filter(tasks, function (task) {
            return !task.accessible.accessible;
          })
        };

        $scope.dependenciesString = function (dependencies) {
          var result = "";
          _.each(dependencies, function (dep) {
            result = result + "\n- " + TaskDependencies.definitions[dep].title;
          });
          return result;
        };

        var linearPVFs = _.filter(problem.criteria, function (criterion) {
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

        var scaleRange = _.every(problem.criteria, function (criterion) {
          return criterion.pvf && criterion.pvf.range;
        }) ? "defined" : "missing";

        $scope.status = {
          scaleRange: scaleRange,
          partialValueFunction: pvfStatus,
          preferences: prefStatus
        };

        $scope.problem = problem;

        $scope.criteria = _.sortBy(_.map(_.pairs(problem.criteria), function (crit, idx) {
          return _.extend(crit[1], { id: crit[0], w: "w_" + (idx + 1) });
        }), "w");

        var w = function (criterionKey) {
          return _.find($scope.criteria, function (crit) { return crit.id === criterionKey; })['w'];
        };

        var eqns = _.map(state.prefs, function (pref) {
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

        var eqnArray = "\\begin{eqnarray} " + _.reduce(eqns, function (memo, eqn) { return memo + eqn; }, "") + " \\end{eqnarray}";
        $scope.preferences = eqnArray;

        $scope.getXY = _.memoize(PartialValueFunction.getXY, function (arg) { return angular.toJson(arg.pvf); });

        $scope.isEditTitleVisible = false;

        $scope.editTitle = function () {
          $scope.isEditTitleVisible = true;
          $scope.scenarioTitleCache = $scope.scenario.title;
        };

        $scope.saveTitle = function () {
          $scope.scenario.title = $scope.scenarioTitleCache;
          $scope.scenario.save();
          $scope.isEditTitleVisible = false;
        };

        $scope.cancelTitle = function () {
          $scope.isEditTitleVisible = false;
        };

        $scope.deleteScenario = function () {
          $scope.isEditTitleVisible = false;
        }

        $scope.toggleGoSide = function () {
          $scope.goSide = !$scope.goSide;
        }

        $scope.alternativeVisible = {};

        var findCriteriaNodes = function (valueTree) {
          // FIXME: eliminate this internal function
          function findCriteriaNodesInternal(valueTree, criteriaNodes) {
            if (valueTree.criteria) {
              criteriaNodes.push(valueTree);
            } else {
              angular.forEach(valueTree.children, function (childNode) {
                findCriteriaNodesInternal(childNode, criteriaNodes);
              });
            }
          };

          var criteriaNodes = [];
          findCriteriaNodesInternal(valueTree, criteriaNodes);
          return criteriaNodes;
        };


        var findTreePath = function (criteriaNode, valueTree) {
          if (valueTree.title === criteriaNode.title) {
            return [criteriaNode];
          } else if (valueTree.criteria) {
            // leaf node that we're not looking for
            return [];
          } else {
            var children = [];
            angular.forEach(valueTree.children, function (childNode) {
              var childPaths = findTreePath(criteriaNode, childNode);
              if (childPaths.length > 0) {
                children = [valueTree].concat(childPaths);
              }
            });
            return children;
          }
        };

        var buildEffectsTableData = function (problem) {
          var criteriaNodes = findCriteriaNodes(problem.valueTree);
          var effectsTable = [];

          angular.forEach(criteriaNodes, function (criteriaNode) {
            var path = findTreePath(criteriaNode, problem.valueTree);
            effectsTable.push({
              path: path.slice(1), // omit top-level node
              criteria: _.map(criteriaNode.criteria, function (criterionKey) {
                return {
                  key: criterionKey,
              value: problem.criteria[criterionKey]
                };
              })
            });
          });

          return effectsTable;
        };

        $scope.effectsTableData = buildEffectsTableData(problem);

        // show / hide sidepanel
        $scope.showPanel = true;
        $scope.toggleSidebar = function (criterion) {
          $scope.sideParam = {
            title: criterion.value.title,
            key: criterion.key,
            scales: $scope.scales[criterion.key]
          };
          $scope.showPanel = !$scope.showPanel;
        };

        $scope.editRemarkModal = function (node) {
          console.log(node.remark);
        };

        $scope.nrAlternatives = _.keys(problem.alternatives).length;

        $scope.expandedValueTree = function() {
          var tree = angular.copy(problem.valueTree);
          var criteriaNodes = findCriteriaNodes(tree);
          angular.forEach(criteriaNodes, function(criteriaNode) {
            criteriaNode.children = _.map(criteriaNode.criteria, function(key) {
              return problem.criteria[key];
            });
          });
          return tree;
        }();

      };

      return dependencies.concat(OverviewController);
    });
