/*jshint node: true */
define(['mcda/config', 'mcda/lib/patavi', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
  function(Config, patavi, angular, angularanimate, mmfoundation, _) {
    var dependencies = ['$scope', '$stateParams', 'taskDefinition', 'RemarksResource', 'ValueTreeUtil'];
    var EffectsTableController = function($scope, $stateParams, taskDefinition, RemarksResource, ValueTreeUtil) {

      var remarksCache;


      function buildEffectsTableData(problem) {
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
      }

      function initEffectsTable(workspace) {
        $scope.problem = workspace.problem;
        $scope.effectsTableData = buildEffectsTableData($scope.problem);
        $scope.nrAlternatives = _.keys($scope.problem.alternatives).length;
        $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree($scope.problem.valueTree, $scope.problem.criteria);
      }

      $scope.remarks = {};
      $scope.$parent.taskId = taskDefinition.id;
      $scope.alternativeVisible = {};
      // show / hide sidepanel
      $scope.showPanel = false;
      $scope.onLoadClass = 'animate-hide';

      $scope.workspace.$promise.then(initEffectsTable);

      RemarksResource.get($stateParams, function(remarks) {
        if (remarks.remarks) {
          $scope.remarks = remarks;
        }
        remarksCache = angular.copy(remarks);
      });

      $scope.saveRemarks = function() {
        RemarksResource.save($stateParams, $scope.remarks, function() {
          remarksCache = angular.copy($scope.remarks);
        });
      };

      $scope.cancelRemarks = function() {
        $scope.remarks = angular.copy(remarksCache);
      };


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

    };

    return dependencies.concat(EffectsTableController);
  });
