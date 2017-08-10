'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$stateParams', '$modal', '$state', '$transitions',
    'intervalHull', 'SubProblemResource', 'SubProblemService', 'WorkspaceService', 'mcdaRootPath'
  ];

  var SubProblemController = function($scope, $stateParams, $modal, $state, $transitions,
    intervalHull, SubProblemResource, SubProblemService, WorkspaceService, mcdaRootPath) {
    // vars 
    $scope.problem = $scope.workspace.problem;
    $scope.scales = $scope.workspace.$$scales;
    $scope.criteriaForScales = makeCriteriaForScales($scope.problem.criteria);

    // functions
    $scope.intervalHull = intervalHull;
    $scope.updateInclusions = updateInclusions;
    $scope.openScaleRangeDialog = openScaleRangeDialog;
    $scope.isCreationBlocked = isCreationBlocked;
    $scope.reset = initSubProblem;
    $scope.openSaveDialog = openSaveDialog;
    $scope.isExact = isExact;
    $scope.isBaseline = {}; // TODO: determine baseline
    //init
    $scope.$watch('workspace.$$scales.observed', function(newScales) {
      if (!newScales) {
        return;
      }
      var mergedProblem = WorkspaceService.mergeBaseAndSubProblem($scope.problem, $scope.subProblem.definition);
      $scope.mergedProblem = WorkspaceService.setDefaultObservedScales(mergedProblem, newScales);
      $scope.scales.observed = newScales;
      initSubProblem($scope.subProblem);
    }, true);

    $transitions.onStart({}, function(transition) {
      if (($scope.subProblemState.isChanged || $scope.subProblemState.scaleRangeChanged) && !$scope.subProblemState.savingProblem) {
        var answer = confirm('There are unsaved changes, are you sure you want to navigate away from this page?');
        if (!answer) {
          transition.abort();
        } else {
          $scope.subProblemState.isChanged = false;
          $scope.subProblemState.scaleRangeChanged = false;
        }
      }
    });

    function updateInclusions() {
      $scope.subProblemState.isChanged = !_.isEqual($scope.subProblemState.criterionInclusions, $scope.originalCriterionInclusions) ||
        !_.isEqual($scope.subProblemState.alternativeInclusions, $scope.originalAlternativeInclusions);
      $scope.subProblemState.numberOfCriteriaSelected = _.reduce($scope.subProblemState.criterionInclusions, function(accum, inclusion) {
        return inclusion ? accum + 1 : accum;
      }, 0);
      $scope.subProblemState.numberOfAlternativesSelected = _.reduce($scope.subProblemState.alternativeInclusions, function(accum, inclusion) {
        return inclusion ? accum + 1 : accum;
      }, 0);
    }

    function openSaveDialog() {
      $modal.open({
        templateUrl: mcdaRootPath + 'views/createSubProblem.html',
        controller: 'CreateSubProblemController',
        resolve: {
          subProblemState: function() {
            return $scope.subProblemState;
          },
          subProblems: function() {
            return $scope.subProblems;
          },
          problem: function() {
            return $scope.mergedProblem;
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

    function initSubProblem(subProblem) {
      $scope.originalCriterionInclusions = createCriterionInclusions(subProblem);
      $scope.originalAlternativeInclusions = createAlternativeInclusions(subProblem);
      $scope.subProblemState = {
        criterionInclusions: _.cloneDeep($scope.originalCriterionInclusions),
        alternativeInclusions: _.cloneDeep($scope.originalAlternativeInclusions),
        hasScaleRange: checkScaleRanges($scope.mergedProblem.criteria),
        ranges: _.cloneDeep($scope.mergedProblem.criteria),
        scaleRangeChanged: false
      };
      updateInclusions();
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