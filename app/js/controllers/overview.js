'use strict';
define(['mcda/config', 'mcda/lib/patavi', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
    function (Config, patavi, angular, angularanimate, mmfoundation, _) {
      var dependencies = ['$scope', 'taskDefinition', config.workspacesRepository.type + 'Remarks'];
      var OverviewController = function ($scope, taskDefinition, Remarks) {

        Remarks.get($scope.workspace.id).then(function (remarks) {
          $scope.remarks = remarks;
        });

        $scope.saveRemarks = function () {
          Remarks.save($scope.workspace.id, $scope.remarks);
        };

        $scope.$parent.taskId = taskDefinition.id;


        // FIXME: these calculations really should happen at the workspace level
        // ===========================================
        (function (problem) {
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
        })($scope.workspace.problem);
        // ===========================================

        var problem = $scope.workspace.problem;
        $scope.problem = problem;

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
