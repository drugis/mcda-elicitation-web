'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$stateParams', '$modal', '$state', '$transitions',
    'intervalHull', 'SubProblemResource', 'SubProblemService', 'WorkspaceService', 'mcdaRootPath'
  ];

  var SubProblemController = function($scope, $stateParams, $modal, $state, $transitions,
    intervalHull, SubProblemResource, SubProblemService, WorkspaceService, mcdaRootPath) {
    // functions
    $scope.intervalHull = intervalHull;
    $scope.openScaleRangeDialog = openScaleRangeDialog;
    $scope.isCreationBlocked = isCreationBlocked;
    $scope.openSaveDialog = openSaveDialog;
    $scope.isExact = isExact;

    // init
    $scope.problem = $scope.workspace.problem;
    $scope.scales = _.cloneDeep($scope.workspace.$$scales);
    $scope.criteriaForScales = makeCriteriaForScales($scope.problem.criteria);
    $scope.isBaseline = SubProblemService.determineBaseline($scope.problem.performanceTable, $scope.problem.alternatives);
    $scope.$watch('workspace.$$scales.observed', function(newObservedScales) {
      if (!newObservedScales) {
        return;
      }
      var mergedProblem = WorkspaceService.mergeBaseAndSubProblem($scope.problem, $scope.subProblem.definition);
      $scope.mergedProblem = WorkspaceService.setDefaultObservedScales(mergedProblem, newObservedScales);
      $scope.originalObserved = newObservedScales;
    }, true);

    // $transitions.onStart({}, function(transition) {
    //   if (($scope.subProblemState.isChanged || $scope.subProblemState.scaleRangeChanged) && !$scope.subProblemState.savingProblem) {
    //     var answer = confirm('There are unsaved changes, are you sure you want to navigate away from this page?');
    //     if (!answer) {
    //       transition.abort();
    //     } else {
    //       $scope.subProblemState.isChanged = false;
    //       $scope.subProblemState.scaleRangeChanged = false;
    //     }
    //   }
    // });

    function openSaveDialog() {
      $modal.open({
        templateUrl: mcdaRootPath + 'views/createSubProblem.html',
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
            return $scope.mergedProblem;
          },
          scales: function() {
            return {observed: $scope.newObservedScales};
          },
          callback: function() {
            return function(newProblemId, newScenarioId) {
              $scope.subProblemState.savingProblem = true;
              $state.go('problem', _.extend({}, $stateParams, {
                problemId: newProblemId,
                id: newScenarioId
              }));
            };
          }
        }
      });
    }

    function openScaleRangeDialog() {
      var includedCriteria = _.filter($scope.criteriaForScales, function(criterion) {
        return $scope.subProblemState.criterionInclusions[criterion.id];
      });
      $modal.open({
        templateUrl: mcdaRootPath + 'views/scaleRange.html',
        controller: 'ScaleRangeController',
        resolve: {
          criteria: function() {
            return includedCriteria;
          },
          observedScales: function() {
            return _.pick($scope.scales.observed, _.map(includedCriteria, 'id'));
          },
          callback: function() {
            return function(ranges) {
              $scope.subProblemState.hasScaleRange = true;
              $scope.subProblemState.scaleRangeChanged = true;
              $scope.subProblemState.ranges = ranges;
            };
          }
        }
      });
    }


    function isCreationBlocked() {
      return !$scope.subProblemState || !$scope.subProblemState.hasScaleRange || (!$scope.subProblemState.isChanged && !$scope.subProblemState.scaleRangeChanged);
    }

    // private functions
    function createCriterionInclusions(subProblem) {
      return _.mapValues($scope.problem.criteria, function(criterion, key) {
        return subProblem.definition && !_.includes(subProblem.definition.excludedCriteria, key);
      });
    }

    function createAlternativeInclusions(subProblem) {
      return _.mapValues($scope.problem.alternatives, function(alternative, key) {
        return subProblem.definition && !_.includes(subProblem.definition.excludedAlternatives, key);
      });
    }

    function makeCriteriaForScales(criteria) {
      return _.map(_.toPairs(criteria), function(crit, idx) {
        return _.extend({}, crit[1], {
          id: crit[0],
          w: 'w_' + (idx + 1)
        });
      });
    }

    function checkScaleRanges(criteria) {
      var isMissingScaleRange = _.find(criteria, function(criterion) {
        return !(criterion.pvf && criterion.pvf.range && criterion.pvf.range[0] !== undefined && criterion.pvf.range[1] !== undefined);
      });
      return !isMissingScaleRange;
    }

    function isExact(criterion, alternative) {
      var perf = _.find($scope.problem.performanceTable, function(performance) {
        return performance.alternative === alternative && performance.criterion === criterion;
      });
      return !!perf && perf.performance.type === 'exact';
    }

  };

  return dependencies.concat(SubProblemController);
});