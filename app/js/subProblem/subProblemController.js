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
    'ScaleRangeService'
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
    ScaleRangeService
  ) {
    // functions 
    $scope.openCreateDialog = openCreateDialog;
    $scope.subProblemChanged = subProblemChanged;
    $scope.editSubProblemTitle = editSubProblemTitle;

    // init
    $scope.subProblems = subProblems;
    $scope.scales = $scope.workspace.scales;
    $scope.problem = $scope.aggregateState.problem;
    $scope.isBaseline = SubProblemService.determineBaseline($scope.problem.table = EffectsTableService.b, $scope.problem.alternatives);
    PageTitleService.setPageTitle('SubProblemController', ($scope.problem.title || $scope.workspace.title) + '\'s problem definition');

    $scope.areTooManyDataSourcesIncluded = SubProblemService.areTooManyDataSourcesIncluded($scope.aggregateState.problem.criteria);
    setScaleTable();

    $scope.$watch('workspace.scales', function(newScales, oldScales) {
      if (newScales && oldScales && newScales.observed === oldScales.observed) { return; }
      $scope.scales = newScales;
      setScaleTable();
    }, true);

    $scope.$watch('aggregateState', function(newState, oldState) {
      if (_.isEqual(newState, oldState)) { return; }
      setScaleTable();
    });

    new Clipboard('.clipboard-button');

    function setScaleTable() {
      OrderingService.getOrderedCriteriaAndAlternatives($scope.aggregateState.problem, $stateParams).then(function(orderings) {
        $scope.criteria = orderings.criteria;
        $scope.alternatives = orderings.alternatives;
        var effectsTable = EffectsTableService.buildEffectsTable(getCriteria(orderings.criteria));
        $scope.scaleTable = ScaleRangeService.getScaleTable(effectsTable, $scope.scales, $scope.problem.performanceTable);
        $scope.hasRowWithOnlyMissingValues = SubProblemService.findRowWithoutValues($scope.effectsTableInfo, $scope.scales);
      });
    }

    function getCriteria(orderedCriteria) {
      return _.map(orderedCriteria, function(criterion) {
        return _.merge({}, $scope.problem.criteria[criterion.id], { id: criterion.id });
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
  };

  return dependencies.concat(SubProblemController);
});
