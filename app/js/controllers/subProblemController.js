'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  return function($scope, $stateParams, $modal, $state, intervalHull, SubProblemResource) {
    // vars 
    $scope.problem = $scope.workspace.problem;
    $scope.scales = $scope.workspace.$$scales;

    $scope.$watch('workspace.$$scales.observed', function(newValue) {
      $scope.scales.observed = newValue;
    }, true);

    $scope.criteria = sortCriteria($scope.problem.criteria);

    // functions
    $scope.intervalHull = intervalHull;
    $scope.updateInclusions = updateInclusions;
    $scope.saveProblemConfiguration = saveProblemConfiguration;
    $scope.editTitle = editTitle;
    $scope.saveTitle = saveTitle;

    $scope.subProblemPromise.then(function(subProblem) {
      $scope.subProblem = subProblem;
      $scope.originalInclusions = createInclusions(subProblem);
      $scope.problemState = {
        criterionInclusions: _.cloneDeep($scope.originalInclusions),
        hasScaleRange: checkScaleRanges($scope.problem.criteria)
      };
      updateInclusions();
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
      subProblem.definition.scales = $scope.scales;
      subProblem.definition.problem = $scope.problem.criteria;
      var subProblemCommand = {
        definition: JSON.stringify(subProblem.definition,2,null),
        title: subProblem.title
      };
      SubProblemResource.save(_.omit($stateParams, ['id', 'problemId', 'userUid']), subProblemCommand)
        .$promise.  then(function() {
          $state.go('preferences');
        });
    }

    // private functions
    function createInclusions(subProblem) {
      return _.mapValues($scope.problem.criteria, function(key) {
        return !_.find(subProblem.definition.excludedCriteria, key);
      });
    }

    function sortCriteria(criteria) {
      return _.sortBy(_.map(_.toPairs(criteria), function(crit, idx) {
        return _.extend(crit[1], {
          id: crit[0],
          w: 'w_' + (idx + 1)
        });
      }), 'w');
    }

    function checkScaleRanges(criteria) {
      if (_.find(criteria, function(criterion) {
          if (criterion.pvf && criterion.pvf.range && criterion.pvf.range[0] && criterion.pvf.range[1]) {
            return false;
          }
          return true;
        })) {
        return false;
      }
      return true;
    }
  };
});
