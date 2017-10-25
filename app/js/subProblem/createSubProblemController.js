'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$stateParams', '$modalInstance', '$timeout',
    'ScenarioResource', 'SubProblemResource',
    'SubProblemService', 'ScaleRangeService', 'subProblems', 'subProblem', 'problem', 'scales', 'callback'
  ];
  var CreateSubProblemController = function($scope, $stateParams, $modalInstance, $timeout,
    ScenarioResource, SubProblemResource, SubProblemService, ScaleRangeService,
    subProblems, subProblem, problem, scales, callback) {
    // functions
    $scope.checkDuplicateTitle = checkDuplicateTitle;
    $scope.updateInclusions = updateInclusions;
    $scope.createProblemConfiguration = createProblemConfiguration;
    $scope.isCreationBlocked = isCreationBlocked;
    $scope.cancel = $modalInstance.close;
    $scope.reset = reset;

    // init
    $scope.subProblems = subProblems;
    $scope.originalScales = _.cloneDeep(scales);
    $scope.scales = _.cloneDeep(scales); //FIXME
    initSubProblem(_.cloneDeep(subProblem), _.cloneDeep(problem));
    checkDuplicateTitle($scope.subProblemState.title);
    $scope.isExact = _.partial(SubProblemService.isExact, $scope.problem.performanceTable);
    $scope.isBaseline = SubProblemService.determineBaseline($scope.problem.performanceTable, $scope.problem.alternatives);

    function createProblemConfiguration() {
      var subProblemCommand = {
        definition: SubProblemService.createDefinition($scope.subProblemState, $scope.choices),
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

    function initSubProblem(subProblem, problem) {
      $scope.problem = problem;
      $scope.originalCriterionInclusions = SubProblemService.createCriterionInclusions($scope.problem, subProblem);
      $scope.originalAlternativeInclusions = SubProblemService.createAlternativeInclusions($scope.problem, subProblem);
      $scope.subProblemState = {
        criterionInclusions: $scope.originalCriterionInclusions,
        alternativeInclusions: $scope.originalAlternativeInclusions,
        ranges: _.merge($scope.problem.criteria, subProblem.definition.ranges)
      };
      updateInclusions();
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      }, 100);
    }

    function updateInclusions() {
      $scope.subProblemState.numberOfCriteriaSelected = _.filter($scope.subProblemState.criterionInclusions).length;
      $scope.subProblemState.numberOfAlternativesSelected = _.filter($scope.subProblemState.alternativeInclusions).length;
      var includedCriteria = _.keys(_.pickBy($scope.subProblemState.criterionInclusions));
      var includedAlternatives = _.keys(_.pickBy($scope.subProblemState.alternativeInclusions));

      $scope.criteria = _.pick($scope.problem.criteria, includedCriteria);

      var includedScales = _.pick($scope.originalScales.observed, includedCriteria);
      $scope.observedScales = _.mapValues(includedScales, function(value) {
        return _.pick(value, includedAlternatives);
      });
      initializeScales();
    }

    function initializeScales() {
      var stateAndChoices = ScaleRangeService.getScaleStateAndChoices($scope.observedScales, $scope.criteria);
      $scope.scalesState = stateAndChoices.scaleState;
      $scope.choices = stateAndChoices.choices;
    }

    function reset() {
      var titleCache = $scope.subProblemState.title;
      initSubProblem({
        definition: {
          excludedCriteria: [],
          excludedAlternatives: []
        }
      }, _.cloneDeep(problem));
      $scope.subProblemState.title = titleCache;
    }

    // private functions
    function checkDuplicateTitle(title) {
      $scope.isTitleDuplicate = _.find($scope.subProblems, ['title', title]);
    }

    function isCreationBlocked() {
      return !$scope.subProblemState || !$scope.subProblemState.hasScaleRange || (!$scope.subProblemState.isChanged && !$scope.subProblemState.scaleRangeChanged);
    }
  };
  return dependencies.concat(CreateSubProblemController);
});