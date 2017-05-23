'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$stateParams', '$modal', '$state', 'intervalHull', 'SubProblemResource', 'SubProblemService', 'WorkspaceService', 'mcdaRootPath'];

  var SubProblemController = function($scope, $stateParams, $modal, $state, intervalHull, SubProblemResource, SubProblemService, WorkspaceService, mcdaRootPath) {
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

    //init
    $scope.$watch('workspace.$$scales.observed', function(newScales, oldScalesIfAny) {
      if (newScales === oldScalesIfAny) {
        return;
      }
      var mergedProblem = WorkspaceService.mergeBaseAndSubProblem($scope.problem, $scope.subProblem.definition);
      $scope.mergedProblem = WorkspaceService.setDefaultObservedScales(mergedProblem, newScales);
      $scope.scales.observed = newScales;
      initSubProblem($scope.subProblem);
    }, true);

    function updateInclusions() {
      $scope.subProblemState.isChanged = !_.isEqual($scope.subProblemState.criterionInclusions, $scope.originalInclusions);
      $scope.subProblemState.numberOfCriteriaSelected = _.reduce($scope.subProblemState.criterionInclusions, function(accum, inclusion) {
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
              $state.go('preferences', _.extend({}, $stateParams, {
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
      $scope.originalInclusions = createInclusions(subProblem);
      $scope.subProblemState = {
        criterionInclusions: _.cloneDeep($scope.originalInclusions),
        hasScaleRange: checkScaleRanges($scope.mergedProblem.criteria),
        ranges: _.cloneDeep($scope.mergedProblem.criteria),
        scaleRangeChanged: false
      };
      updateInclusions();
    }

    function isCreationBlocked() {
      return  !$scope.subProblemState || !$scope.subProblemState.hasScaleRange || (!$scope.subProblemState.isChanged && !$scope.subProblemState.scaleRangeChanged);
    }

    // private functions
    function createInclusions(subProblem) {
      return _.mapValues($scope.problem.criteria, function(criterion, key) {
        return subProblem.definition && !_.includes(subProblem.definition.excludedCriteria, key);
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

  };

  return dependencies.concat(SubProblemController);
});
