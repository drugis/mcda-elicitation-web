'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$stateParams', '$modal', '$state', 'intervalHull', 'SubProblemResource', 'SubProblemService', 'mcdaRootPath'];

  var SubProblemController = function($scope, $stateParams, $modal, $state, intervalHull, SubProblemResource, SubProblemService, mcdaRootPath) {
    // vars 
    $scope.problem = $scope.workspace.problem;
    $scope.scales = $scope.workspace.$$scales;
    $scope.criteriaForScales = makeCriteriaForScales($scope.problem.criteria);
    $scope.subProblemState = {};

    // functions
    $scope.intervalHull = intervalHull;
    $scope.updateInclusions = updateInclusions;
    $scope.saveProblemConfiguration = saveProblemConfiguration;
    $scope.editTitle = editTitle;
    $scope.saveTitle = saveTitle;
    $scope.openScaleRangeDialog = openScaleRangeDialog;
    $scope.isCreationAllowed = isCreationAllowed;
    $scope.reset = initSubProblem;
    $scope.checkDuplicateTitle = checkDuplicateTitle;

    //init
    $scope.$watch('workspace.$$scales.observed', function(newValue) {
      $scope.scales.observed = newValue;
    }, true);
    $scope.subProblemPromise.then(function(subProblem) {
      $scope.subProblem = subProblem;
      initSubProblem(subProblem);
    });
    SubProblemResource.query({
      projectId: $stateParams.projectId,
      analysisId: $stateParams.analysisId
    }).$promise.then(function(subProblems) {
      $scope.subProblems = subProblems;
    });

    function updateInclusions() {
      $scope.subProblemState.isChanged = !_.isEqual($scope.subProblemState.criterionInclusions, $scope.originalInclusions);
      $scope.subProblemState.numberOfCriteriaSelected = _.reduce($scope.subProblemState.criterionInclusions, function(accum, inclusion) {
        return inclusion ? accum + 1 : accum;
      }, 0);
    }

    function editTitle() {
      $scope.isEditTitleVisible = true;
    }

    function saveTitle() {
      $scope.isEditTitleVisible = false;
    }

    function checkDuplicateTitle(title) {
      $scope.subProblemState.isTitleDuplicate = _.find($scope.subProblems, function(subProblem) {
        return title === subProblem.title;
      });
    }

    function saveProblemConfiguration() {
      var subProblemCommand = {
        definition: SubProblemService.createDefinition($scope.problem, $scope.subProblemState),
        title: $scope.subProblem.title,
        scenarioState: SubProblemService.createDefaultScenarioState($scope.problem, $scope.subProblemState)
      };
      SubProblemResource.save(_.omit($stateParams, ['id', 'problemId', 'userUid']), subProblemCommand)
        .$promise.then(function(newProblem) {
          //TODO use newly made problem id
          $state.go('preferences');
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
        hasScaleRange: checkScaleRanges($scope.problem.criteria),
        scaleRangeChanged: false
      };
      updateInclusions();
    }

    function isCreationAllowed() {
      return !$scope.subProblemState.hasScaleRange || (!$scope.subProblemState.isChanged && !$scope.subProblemState.scaleRangeChanged);
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
