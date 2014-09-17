'use strict';
define(['mcda/config', 'mcda/lib/patavi', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
  function(Config, patavi, angular, angularanimate, mmfoundation, _) {
    var dependencies = ['$scope', '$stateParams', 'taskDefinition', window.config.workspacesRepository.type + 'Remarks', 'ValueTreeUtil'];
    var EffectsTableController = function($scope, $stateParams, taskDefinition, Remarks, ValueTreeUtil) {

      var remarksCache;

      $scope.remarks = {
        analysisId: $scope.analysis.id
      };

      Remarks.get($stateParams, function(remarks) {
        if (remarks.remarks) {
          $scope.remarks = remarks;
        }
        remarksCache = angular.copy(remarks);
      });

      $scope.saveRemarks = function() {
        Remarks.save($stateParams, $scope.remarks, function() {
          remarksCache = angular.copy($scope.remarks);
        });
      };

      $scope.cancelRemarks = function() {
        $scope.remarks = angular.copy(remarksCache);
      }

      $scope.$parent.taskId = taskDefinition.id;

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

      var problem = $scope.workspace.problem;
      $scope.problem = problem;

      $scope.alternativeVisible = {};

      var buildEffectsTableData = function(problem) {
        var criteriaNodes = ValueTreeUtil.findCriteriaNodes(problem.valueTree);
        var effectsTable = [];

        angular.forEach(criteriaNodes, function(criteriaNode) {
          var path = ValueTreeUtil.findTreePath(criteriaNode, problem.valueTree);
          effectsTable.push({
            path: path.slice(1), // omit top-level node
            criteria: _.map(criteriaNode.criteria, function(criterionKey) {
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
      $scope.showPanel = false;
      $scope.onLoadClass = 'animate-hide';
      $scope.toggleSidebar = function(criterion) {
        if ($scope.showPanel && criterion.key === $scope.sideParam.key) {
          $scope.showPanel = !$scope.showPanel;
        } else {
          $scope.showPanel = true;
        }
        $scope.sideParam = {
          title: criterion.value.title,
          key: criterion.key,
          scales: $scope.scales[criterion.key]
        };
      };

      $scope.editRemarkModal = function(node) {
        console.log(node.remark);
      };

      $scope.nrAlternatives = _.keys(problem.alternatives).length;

      $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree(problem.valueTree, problem.criteria);
    };

    return dependencies.concat(EffectsTableController);
  });