'use strict';
define(['lodash', 'clipboard', 'angular'], function(_, Clipboard) {
  var dependencies = [
    '$scope',
    '$stateParams',
    '$modal',
    '$state',
    'subProblems',
    'SubProblemService',
    'ScenarioResource',
    'OrderingService',
    'SubProblemResource',
    'EffectsTableService',
    'PageTitleService',
    'ScaleRangeService',
    'WorkspaceSettingsService',
    'significantDigits'
  ];

  var SubProblemController = function(
    $scope,
    $stateParams,
    $modal,
    $state,
    subProblems,
    SubProblemService,
    ScenarioResource,
    OrderingService,
    SubProblemResource,
    EffectsTableService,
    PageTitleService,
    ScaleRangeService,
    WorkspaceSettingsService,
    significantDigits
  ) {
    // functions 
    $scope.openCreateDialog = openCreateDialog;
    $scope.subProblemChanged = subProblemChanged;
    $scope.editSubProblemTitle = editSubProblemTitle;
    $scope.significantDigits = significantDigits;
    $scope.deleteSubproblem = deleteSubproblem;

    // init
    $scope.scalesPromise.then(function() {
      $scope.subProblems = subProblems;
      $scope.scales = $scope.workspace.scales;
      $scope.isBaseline = SubProblemService.determineBaseline($scope.aggregateState.problem.table, $scope.aggregateState.problem.alternatives);
      PageTitleService.setPageTitle('SubProblemController', ($scope.aggregateState.problem.title || $scope.workspace.title) + '\'s problem definition');
      $scope.areTooManyDataSourcesIncluded = SubProblemService.areTooManyDataSourcesIncluded($scope.aggregateState.problem.criteria);
      setScaleTable();
    });

    $scope.$watch('workspace.scales', function(newScales, oldScales) {
      if (newScales && oldScales && newScales.observed === oldScales.observed) {
        return;
      } else {
        $scope.scales = newScales;
        setScaleTable();
      }
    }, true);

    new Clipboard('.clipboard-button');

    function setScaleTable() {
      var problem = WorkspaceSettingsService.usePercentage() ? $scope.aggregateState.percentified.problem : $scope.aggregateState.dePercentified.problem;
      OrderingService.getOrderedCriteriaAndAlternatives(problem, $stateParams).then(function(orderings) {
        $scope.criteria = orderings.criteria;
        $scope.alternatives = orderings.alternatives;
        var effectsTable = EffectsTableService.buildEffectsTable(getCriteria(orderings.criteria, problem));
        $scope.scaleTable = ScaleRangeService.getScaleTable(effectsTable, $scope.scales, $scope.aggregateState.problem.performanceTable);
        $scope.hasRowWithOnlyMissingValues = SubProblemService.findRowWithoutValues($scope.effectsTableInfo, $scope.scales);
      });
    }

    function getCriteria(orderedCriteria, problem) {
      return _.map(orderedCriteria, function(criterion) {
        return _.merge({}, problem.criteria[criterion.id], { id: criterion.id });
      });
    }

    function openCreateDialog() {
      $modal.open({
        templateUrl: './createSubProblem.html',
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
            return $scope.baseState.dePercentified.problem;
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

    function editSubProblemTitle() {
      $modal.open({
        templateUrl: './editSubProblemTitle.html',
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

    function deleteSubproblem() {
      $modal.open({
        templateUrl: './deleteSubproblem.html',
        controller: 'DeleteSubproblemController',
        resolve: {
          subproblem: function() {
            return $scope.subProblem;
          },
          callback: function() {
            return function() {
              SubProblemResource.delete($stateParams).$promise.then(function() {
                var otherSubproblem = _.reject($scope.subProblems, ['id', $scope.subProblem.id])[0];
                subProblemChanged(otherSubproblem);
              });
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
  };

  return dependencies.concat(SubProblemController);
});
