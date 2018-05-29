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
    $scope.scales = _.cloneDeep(scales);
    initSubProblem(_.cloneDeep(subProblem), _.cloneDeep(problem));
    $scope.isBaseline = SubProblemService.determineBaseline($scope.problem.performanceTable, $scope.problem.alternatives);
    $scope.effectsTableInfo = effectsTableInfo;
    $scope.editMode = editMode;

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

        $scope.criteriaByDataSource = _($scope.criteria)
          .map(function(criterion) {
            return _.map(criterion.dataSources, function(dataSource) {
              return [dataSource.id, criterion.id]
            });
          })
          .flatten()
          .fromPairs()
          .value();

        $scope.subProblemState = {
          criterionInclusions: SubProblemService.createCriterionInclusions($scope.problem, subProblem),
          alternativeInclusions: SubProblemService.createAlternativeInclusions($scope.problem, subProblem),
          dataSourceInclusions: SubProblemService.createDataSourceInclusions($scope.problem, subProblem),
          ranges: _.merge({}, _.keyBy($scope.criteria, 'id'), subProblem.definition.ranges)//
        };
        updateInclusions();
        initializeScales();
        checkDuplicateTitle($scope.subProblemState.title);
      });
    }

    function updateInclusions() {
      $scope.subProblemState.dataSourceInclusions = SubProblemService.excludeDataSourcesForExcludedCriteria(
        $scope.problem.criteria, $scope.subProblemState);
      $scope.subProblemState.numberOfCriteriaSelected = _.filter($scope.subProblemState.criterionInclusions).length;
      $scope.subProblemState.numberOfAlternativesSelected = _.filter($scope.subProblemState.alternativeInclusions).length;
      $scope.subProblemState.numberOfDataSourcesPerCriterion = _.mapValues($scope.problem.criteria, function(criterion) {
        return _.filter(criterion.dataSources, function(dataSource) {
          return $scope.subProblemState.dataSourceInclusions[dataSource.id];
        }).length;
      });
      $scope.hasMissingValues = areThereMissingValues();
      $scope.areTooManyDataSourcesSelected = _.find($scope.subProblemState.numberOfDataSourcesPerCriterion, function(n) {
        return n > 1;
      });
      $scope.scalesDataSources = $scope.hasMissingValues ||
        $scope.areTooManyDataSourcesSelected ? [] : _.keys(_.pickBy($scope.subProblemState.dataSourceInclusions));
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      }, 100);
    }

    function initializeScales() {
      var stateAndChoices = ScaleRangeService.getScaleStateAndChoices($scope.scales.observed, $scope.criteria);
      $scope.scalesState = stateAndChoices.scaleState;
      $scope.choices = stateAndChoices.choices;
      _.forEach($scope.choices, function(choice, dataSourceId) {
        if (choice.from > $scope.scalesState[dataSourceId].sliderOptions.restrictedRange.from) {
          choice.from = $scope.scalesState[dataSourceId].sliderOptions.restrictedRange.from;
        }
        if (choice.to < $scope.scalesState[dataSourceId].sliderOptions.restrictedRange.to) {
          choice.to = $scope.scalesState[dataSourceId].sliderOptions.restrictedRange.to;
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

    function areThereMissingValues() {
      var includedDataSourcesIds = _.keys(_.pickBy($scope.subProblemState.dataSourceInclusions));
      var includedAlternatives = _.keys(_.pickBy($scope.subProblemState.alternativeInclusions));
      return _.find(includedDataSourcesIds, function(dataSourceId){
        return _.find(includedAlternatives, function(alternativeId){
          return $scope.scales.observed[dataSourceId][alternativeId]['50%'] === null;
        });
      });
    }

    function isASliderInvalid() {
      $scope.invalidSlider = false;
      _.forEach($scope.scalesDataSources, function(dataSource) {
        var from = $scope.choices[dataSource].from;
        var to = $scope.choices[dataSource].to;
        var restrictedFrom = $scope.scalesState[dataSource].sliderOptions.restrictedRange.from;
        var restrictedTo = $scope.scalesState[dataSource].sliderOptions.restrictedRange.to;
        // check if there is a value inside or at the wrong side of the red area
        if (from > restrictedFrom || to < restrictedTo) {
          $scope.invalidSlider = true;
        }
      });
    }
  };
  return dependencies.concat(CreateSubProblemController);
});
