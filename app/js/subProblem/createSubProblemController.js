'use strict';
define(['lodash', 'angular'], function(_) {

  var dependencies = ['$scope', '$stateParams', '$modalInstance', '$timeout',
    'ScenarioResource',
    'SubProblemResource',
    'SubProblemService',
    'ScaleRangeService',
    'OrderingService',
    'EffectsTableService',
    'subProblems',
    'subProblem',
    'problem',
    'scales',
    'editMode',
    'effectsTableInfo',
    'callback'
  ];
  var CreateSubProblemController = function($scope, $stateParams, $modalInstance, $timeout,
    ScenarioResource,
    SubProblemResource,
    SubProblemService,
    ScaleRangeService,
    OrderingService,
    EffectsTableService,
    subProblems,
    subProblem,
    problem,
    scales,
    editMode,
    effectsTableInfo,
    callback) {
    // functions
    $scope.checkDuplicateTitle = checkDuplicateTitle;
    $scope.updateInclusions = updateInclusions;
    $scope.createProblemConfiguration = createProblemConfiguration;
    $scope.cancel = $modalInstance.close;
    $scope.reset = reset;

    // init
    $scope.subProblems = subProblems;
    $scope.originalScales = _.cloneDeep(scales);
    $scope.scales = _.cloneDeep(scales);
    initSubProblem(_.cloneDeep(subProblem), _.cloneDeep(problem));
    $scope.isBaseline = SubProblemService.determineBaseline($scope.problem.performanceTable, $scope.problem.alternatives);
    $scope.effectsTableInfo = effectsTableInfo;
    $scope.editMode = editMode;

    function isASliderInvalid() {
      $scope.invalidSlider = false;
      _.forEach($scope.scalesDataSources, function(dataSource) {
        var from = $scope.choices[dataSource.id].from;
        var to = $scope.choices[dataSource.id].to;
        var restrictedFrom = $scope.scalesState[dataSource.id].sliderOptions.restrictedRange.from;
        var restrictedTo = $scope.scalesState[dataSource.id].sliderOptions.restrictedRange.to;
        // check if there is a value inside or at the wrong side of the red area
        if (from > restrictedFrom || to < restrictedTo) {
          $scope.invalidSlider = true;
        }
      });
    }

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
      OrderingService.getOrderedCriteriaAndAlternatives($scope.problem, $stateParams).then(function(orderings) {
        $scope.alternatives = orderings.alternatives;
        $scope.criteria = orderings.criteria;
        $scope.tableRows = EffectsTableService.buildEffectsTable($scope.problem.valueTree, orderings.criteria);

        $scope.subProblemState = {
          criterionInclusions: SubProblemService.createCriterionInclusions($scope.problem, subProblem),
          alternativeInclusions: SubProblemService.createAlternativeInclusions($scope.problem, subProblem),
          dataSourceInclusions: SubProblemService.createDataSourceInclusions($scope.problem, subProblem),
          ranges: _.merge({}, _.keyBy($scope.criteria, 'id'), subProblem.definition.ranges)//
        };
        updateInclusions();
        checkDuplicateTitle($scope.subProblemState.title);

        $timeout(function() {
          $scope.$broadcast('rzSliderForceRender');
        }, 100);
      });
    }

    function updateInclusions() {
      $scope.subProblemState.criterionInclusions = SubProblemService.excludeCriteriaWithoutDataSources($scope.problem.criteria, $scope.subProblemState);
      $scope.subProblemState.numberOfCriteriaSelected = _.filter($scope.subProblemState.criterionInclusions).length;
      $scope.subProblemState.numberOfAlternativesSelected = _.filter($scope.subProblemState.alternativeInclusions).length;

      $scope.criteria = _.filter($scope.criteria, function(criterion) {
        return $scope.subProblemState.criterionInclusions[criterion.id];
      });

      $scope.observedScales = getIncludedObservedScales();
      $scope.hasMissingValues = _.find($scope.observedScales, function(scaleRow) {
        return _.find(scaleRow, function(scaleCell) {
          return !scaleCell['50%'];
        });
      });
      initializeScales();
    }

    function getIncludedObservedScales() {
      var includedAlternatives = _.keys(_.pickBy($scope.subProblemState.alternativeInclusions));
      var includedDataSources = _.keys(_.pickBy($scope.subProblemState.dataSourceInclusions));
      var includedScales = _.pick($scope.originalScales.observed, includedDataSources);
      return _.mapValues(includedScales, function(value) {
        return _.pick(value, includedAlternatives);
      });
    }

    function initializeScales() {
      var stateAndChoices = ScaleRangeService.getScaleStateAndChoices($scope.observedScales, $scope.criteria);
      $scope.scalesState = stateAndChoices.scaleState;
      $scope.choices = stateAndChoices.choices;
      _.forEach($scope.choices, function(choice, key) {
        if (choice.from > $scope.scalesState[key].sliderOptions.restrictedRange.from) {
          choice.from = $scope.scalesState[key].sliderOptions.restrictedRange.from;
        }
        if (choice.to < $scope.scalesState[key].sliderOptions.restrictedRange.to) {
          choice.to = $scope.scalesState[key].sliderOptions.restrictedRange.to;
        }
      });
      $scope.$watch('choices', isASliderInvalid, true);
    }

    function reset() {
      var titleCache = $scope.subProblemState.title;
      initSubProblem({
        definition: {
          excludedCriteria: [],
          excludedAlternatives: [],
          excludedDataSources: []
        }
      }, _.cloneDeep(problem));
      $scope.subProblemState.title = titleCache;
    }

    // private functions
    function checkDuplicateTitle(title) {
      $scope.isTitleDuplicate = _.find($scope.subProblems, ['title', title]);
    }

  };
  return dependencies.concat(CreateSubProblemController);
});
