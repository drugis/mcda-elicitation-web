'use strict';
define(['lodash', 'clipboard', 'angular'], function(_, Clipboard) {

  var dependencies = [
    '$scope', '$stateParams', '$modal', '$state',
    'intervalHull',
    'SubProblemService',
    'ScenarioResource',
    'OrderingService',
    'mcdaRootPath',
    'subProblems',
    'SubProblemResource',
    'EffectsTableService',
    'PageTitleService',
    'WorkspaceService'
  ];

  var SubProblemController = function(
    $scope, $stateParams, $modal, $state,
    intervalHull,
    SubProblemService,
    ScenarioResource,
    OrderingService,
    mcdaRootPath,
    subProblems,
    SubProblemResource,
    EffectsTableService,
    PageTitleService,
    WorkspaceService
  ) {
    // functions 
    $scope.intervalHull = intervalHull;
    $scope.openCreateDialog = openCreateDialog;
    $scope.subProblemChanged = subProblemChanged;
    $scope.editSubProblemTitle = editSubProblemTitle;

    // init
    $scope.subProblems = subProblems;
    $scope.problem = _.cloneDeep($scope.workspace.problem);
    $scope.isBaseline = SubProblemService.determineBaseline($scope.problem.performanceTable, $scope.problem.alternatives);
    $scope.scalesPromise.then(function(scales) {
      $scope.scales = scales;
    });
    PageTitleService.setPageTitle('SubProblemController', ($scope.problem.title || $scope.workspace.title) +'\'s problem definition');

    var mergedProblem = WorkspaceService.mergeBaseAndSubProblem($scope.problem, $scope.subProblem.definition);
    $scope.areTooManyDataSourcesIncluded = _.find(mergedProblem.criteria, function(criterion) {
      return criterion.dataSources.length > 1;
    });
    OrderingService.getOrderedCriteriaAndAlternatives(mergedProblem, $stateParams).then(function(orderings) {
      $scope.criteria = orderings.criteria;
      $scope.alternatives = orderings.alternatives;

      $scope.scaleTable = _.reject(EffectsTableService.buildEffectsTable(orderings.criteria), ['isHeaderRow', true]);
    });

    new Clipboard('.clipboard-button');

    function openCreateDialog() {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/subProblem/createSubProblem.html',
        controller: 'CreateSubProblemController',
        size: 'large',
        resolve: {
          subProblems: function() {
            return $scope.subProblems;
          },
          subProblem: function() {
            return $scope.subProblem;
          },
          problem: function() {
            return $scope.problem;
          },
          scales: function() {
            return $scope.scales;
          },
          editMode: function() {
            return $scope.editMode;
          },
          effectsTableInfo: function() {
            return $scope.effectsTableInfo;
          },
          callback: function() {
            return function(newProblemId, newScenarioId) {
              $state.go('problem', _.extend({}, $stateParams, {
                problemId: newProblemId,
                id: newScenarioId
              }));
            };
          }
        }
      });
    }

    function subProblemChanged(newSubProblem) {
      var coords = _.omit($stateParams, 'id');
      coords.problemId = newSubProblem.id;
      ScenarioResource.query(coords).$promise.then(function(scenarios) {
        $state.go('problem', {
          workspaceId: $scope.workspace.id,
          problemId: newSubProblem.id,
          id: scenarios[0].id
        });
      });
    }

    function editSubProblemTitle() {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/subProblem/editSubProblemTitle.html',
        controller: 'EditSubProblemTitleController',
        resolve: {
          subProblems: function() {
            return $scope.subProblems;
          },
          subProblem: function() {
            return $scope.subProblem;
          },
          callback: function() {
            return function(newTitle) {
              $scope.subProblem.title = newTitle;
              SubProblemResource.save($stateParams, $scope.subProblem).$promise.then(function() {
                $state.reload();
              });
            };
          }
        }
      });
    }

  };

  return dependencies.concat(SubProblemController);
});
