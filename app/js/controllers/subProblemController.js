'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$stateParams', '$modal', '$state', 'intervalHull', 'SubProblemResource', 'mcdaRootPath'];

  var SubProblemController = function($scope, $stateParams, $modal, $state, intervalHull, SubProblemResource, mcdaRootPath) {
    // vars 
    $scope.problem = $scope.workspace.problem;
    $scope.scales = $scope.workspace.$$scales;
    $scope.criteriaForScales = makeCriteriaForScales($scope.problem.criteria);
    $scope.problemState = {};

    // functions
    $scope.intervalHull = intervalHull;
    $scope.updateInclusions = updateInclusions;
    $scope.saveProblemConfiguration = saveProblemConfiguration;
    $scope.editTitle = editTitle;
    $scope.saveTitle = saveTitle;
    $scope.openScaleRangeDialog = openScaleRangeDialog;
    $scope.isCreationAllowed = isCreationAllowed;
    $scope.reset = initSubProblem;

    //init
    $scope.$watch('workspace.$$scales.observed', function(newValue) {
      $scope.scales.observed = newValue;
    }, true);
    $scope.subProblemPromise.then(function(subProblem) {
      $scope.subProblem = subProblem;
      initSubProblem(subProblem);
    });

    function updateInclusions() {
      $scope.problemState.isChanged = !_.isEqual($scope.problemState.criterionInclusions, $scope.originalInclusions);
      $scope.problemState.numberOfCriteriaSelected = _.reduce($scope.problemState.criterionInclusions, function(accum, inclusion) {
        return inclusion ? accum + 1 : accum;
      }, 0);
    }

    function editTitle() {
      $scope.isEditTitleVisible = true;
    }

    function saveTitle() {
      $scope.isEditTitleVisible = false;
    }

    function saveProblemConfiguration() {
      var subProblem = _.omit($scope.subProblem, ['id', 'workspaceId']);
      subProblem.definition.criteria = $scope.problem.criteria;
      var subProblemCommand = {
        definition: JSON.stringify(subProblem.definition, 2, null),
        title: subProblem.title
      };
      SubProblemResource.save(_.omit($stateParams, ['id', 'problemId', 'userUid']), subProblemCommand)
        .$promise.then(function() {
          $state.go('preferences');
        });
    }

    function openScaleRangeDialog() {
      var includedCriteria = _.filter($scope.criteriaForScales, function(criterion) {
        return $scope.problemState.criterionInclusions[criterion.id];
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
            return function() {
              $scope.problemState.hasScaleRange = true;
              $scope.problemState.scaleRangeChanged = true;
            };
          }
        }
      });
    }

    function initSubProblem(subProblem) {
      $scope.originalInclusions = createInclusions(subProblem);
      $scope.problemState = {
        criterionInclusions: _.cloneDeep($scope.originalInclusions),
        hasScaleRange: checkScaleRanges($scope.problem.criteria),
        scaleRangeChanged: false
      };
      updateInclusions();
    }

    function isCreationAllowed() {
      return !$scope.problemState.hasScaleRange || (!$scope.problemState.isChanged && !$scope.problemState.scaleRangeChanged);
    }

    // private functions
    function createInclusions(subProblem) {
      return _.mapValues($scope.problem.criteria, function(key) {
        return !_.find(subProblem.definition.excludedCriteria, key);
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
        return !(criterion.pvf && criterion.pvf.range && criterion.pvf.range[0] && criterion.pvf.range[1]);
      });
      return !isMissingScaleRange;
    }

  };

  return dependencies.concat(SubProblemController);
});
