'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$stateParams', '$modalInstance', 'ScenarioResource', 'SubProblemResource', 'SubProblemService',
    'subProblemState', 'subProblems', 'subProblem', 'problem', 'observedScales', 'callback'
  ];
  var CreateSubProblemController = function($scope, $stateParams, $modalInstance, ScenarioResource, SubProblemResource, SubProblemService,
    subProblemState, subProblems, subProblem, problem, observedScales, callback) {
    // functions
    $scope.checkDuplicateTitle = checkDuplicateTitle;
    $scope.updateInclusions = updateInclusions;
    $scope.createProblemConfiguration = createProblemConfiguration;
    $scope.cancel = $modalInstance.close();

    // init
    $scope.subProblemState = _.cloneDeep(subProblemState);
    $scope.subProblems = _.cloneDeep(subProblems);
    $scope.subProblem = _.cloneDeep(subProblem);
    $scope.problem = _.cloneDeep(problem);
    $scope.originalObserved = _.cloneDeep(observedScales);
    initSubProblem($scope.subProblem);
    checkDuplicateTitle($scope.subProblemState.title);

    function createProblemConfiguration() {
      var subProblemCommand = {
        definition: SubProblemService.createDefinition($scope.problem, $scope.subProblemState),
        title: $scope.subProblemState.title,
        scenarioState: SubProblemService.createDefaultScenarioState($scope.problem, $scope.subProblemState)
      };
      SubProblemResource.save(_.omit($stateParams, ['id', 'problemId', 'userUid']), subProblemCommand)
        .$promise.then(function(newProblem) {
          ScenarioResource.query(_.extend({}, _.omit($stateParams, 'id'), {
            problemId: newProblem.id
          })).$promise.then(function(scenarios) {
            callback(newProblem.id, scenarios[0].id);
            $modalInstance.close();
          });
        });
    }

    function updateInclusions() {
      $scope.subProblemState.isChanged = !_.isEqual($scope.subProblemState.criterionInclusions, $scope.originalCriterionInclusions) ||
        !_.isEqual($scope.subProblemState.alternativeInclusions, $scope.originalAlternativeInclusions);
      $scope.subProblemState.numberOfCriteriaSelected = _.reduce($scope.subProblemState.criterionInclusions, function(accum, inclusion) {
        return inclusion ? accum + 1 : accum;
      }, 0);
      $scope.subProblemState.numberOfAlternativesSelected = _.reduce($scope.subProblemState.alternativeInclusions, function(accum, inclusion) {
        return inclusion ? accum + 1 : accum;
      }, 0);
      $scope.observedScales = _.reduce($scope.originalObserved, function(accum, criterion, critKey) {
        accum[critKey] = _.reduce(criterion, function(accum, alternative, altKey) {
          if ($scope.subProblemState.alternativeInclusions[altKey]) {
            accum[altKey] = alternative;
          }
          return accum;
        }, {});
        return accum;
      }, {});
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
    // private functions
    function createCriterionInclusions(subProblem) {
      return _.mapValues($scope.problem.criteria, function(criterion, key) {
        return subProblem.definition && !_.includes(subProblem.definition.excludedCriteria, key);
      });
    }

    function checkScaleRanges(criteria) {
      var isMissingScaleRange = _.find(criteria, function(criterion) {
        return !(criterion.pvf && criterion.pvf.range && criterion.pvf.range[0] !== undefined && criterion.pvf.range[1] !== undefined);
      });
      return !isMissingScaleRange;
    }

    function createAlternativeInclusions(subProblem) {
      return _.mapValues($scope.problem.alternatives, function(alternative, key) {
        return subProblem.definition && !_.includes(subProblem.definition.excludedAlternatives, key);
      });
    }

    function checkDuplicateTitle(title) {
      $scope.isTitleDuplicate = _.find($scope.subProblems, ['title', title]);
    }
  };
  return dependencies.concat(CreateSubProblemController);
});