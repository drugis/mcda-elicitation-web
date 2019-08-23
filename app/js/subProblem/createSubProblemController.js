'use strict';
define(['lodash', 'angular'], function(_, angular) {

  var dependencies = [
    '$scope',
    '$stateParams',
    '$modalInstance',
    '$timeout',
    'ScenarioResource',
    'SubProblemResource',
    'SubProblemService',
    'ScaleRangeService',
    'OrderingService',
    'EffectsTableService',
    'WorkspaceService',
    'WorkspaceSettingsService',
    'subProblems',
    'subProblem',
    'problem',
    'scales',
    'editMode',
    'effectsTableInfo',
    'callback'
  ];
  var CreateSubProblemController = function(
    $scope,
    $stateParams,
    $modalInstance,
    $timeout,
    ScenarioResource,
    SubProblemResource,
    SubProblemService,
    ScaleRangeService,
    OrderingService,
    EffectsTableService,
    WorkspaceService,
    WorkspaceSettingsService,
    subProblems,
    subProblem,
    problem,
    scales,
    editMode,
    effectsTableInfo,
    callback
  ) {
    // functions
    $scope.checkDuplicateTitle = checkDuplicateTitle;
    $scope.updateInclusions = updateInclusions;
    $scope.createProblemConfiguration = createProblemConfiguration;
    $scope.cancel = $modalInstance.close;
    $scope.reset = reset;

    // init
    $scope.subProblems = subProblems;
    $scope.scales = angular.copy(scales.base);
    $scope.originalScales = scales;
    getWorkspaceSettings();
    initSubProblem(subProblem, problem);
    $scope.isBaseline = SubProblemService.determineBaseline($scope.problem.performanceTable, $scope.problem.alternatives);
    $scope.effectsTableInfo = effectsTableInfo;
    $scope.editMode = editMode;
    var orderedCriteria;

    // $scope.$watch('originalScales', function(newScales, oldScales) {
    //   if (newScales && oldScales && newScales.observed === oldScales.observed) { return; }
    //   $scope.scales = angular.copy(newScales.base);
    //   initializeScales();
    // }, true);

    $scope.$on('elicit.settingsChanged', function() {
      getWorkspaceSettings();
      setProblem();
      setTableRows();
      initializeScales();
    });

    function getWorkspaceSettings() {
      $scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
      $scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
    }

    function createProblemConfiguration() {
      var subProblemCommand = SubProblemService.createSubProblemCommand($scope.subProblemState, $scope.choices, $scope.problem);
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
      var newSubProblem = angular.copy(subProblem);

      $scope.percentifiedProblem = WorkspaceService.percentifyCriteria({
        problem: problem
      }).problem;
      $scope.dePercentifiedProblem = WorkspaceService.dePercentifyCriteria({
        problem: problem
      }).problem;
      setProblem();

      $scope.orderingPromise = OrderingService.getOrderedCriteriaAndAlternatives($scope.problem, $stateParams).then(function(orderings) {
        $scope.alternatives = orderings.alternatives;
        $scope.nrAlternatives = _.keys($scope.alternatives).length;
        orderedCriteria = getCriteria(orderings.criteria);
        $scope.tableRows = EffectsTableService.buildEffectsTable(getCriteria(orderedCriteria));
        $scope.criteriaByDataSource = SubProblemService.getCriteriaByDataSource(orderedCriteria);
        $scope.subProblemState = SubProblemService.createSubProblemState($scope.problem, newSubProblem, orderedCriteria);

        updateInclusions();
        checkDuplicateTitle($scope.subProblemState.title);
      });
    }

    function setProblem() {
      $scope.problem = $scope.workspaceSettings.showPercentages ?
        $scope.percentifiedProblem :
        $scope.dePercentifiedProblem;
    }

    function setTableRows() {
      $scope.orderingPromise.then(function() {
        $scope.tableRows = EffectsTableService.buildEffectsTable(getCriteria(orderedCriteria));
      });
    }

    function getCriteria(orderedCriteria) {
      return _.map(orderedCriteria, function(criterion) {
        return _.merge({}, $scope.problem.criteria[criterion.id], { id: criterion.id });
      });
    }

    function updateInclusions() {
      $scope.subProblemState.dataSourceInclusions = SubProblemService.excludeDataSourcesForExcludedCriteria(
        $scope.problem.criteria, $scope.subProblemState);
      $scope.subProblemState.numberOfCriteriaSelected = _.filter($scope.subProblemState.criterionInclusions).length;
      $scope.subProblemState.numberOfAlternativesSelected = _.filter($scope.subProblemState.alternativeInclusions).length;
      $scope.subProblemState.numberOfDataSourcesPerCriterion = SubProblemService.getNumberOfDataSourcesPerCriterion($scope.problem.criteria, $scope.subProblemState.dataSourceInclusions);
      $scope.hasMissingValues = SubProblemService.areValuesMissingInEffectsTable($scope.subProblemState, $scope.scales, $scope.problem.performanceTable);
      $scope.areTooManyDataSourcesSelected = SubProblemService.areTooManyDataSourcesSelected($scope.subProblemState.numberOfDataSourcesPerCriterion);
      $scope.scalesDataSources = getDataSourcesForScaleSliders();
      $scope.warnings = SubProblemService.getMissingValueWarnings($scope.subProblemState, $scope.scales, $scope.problem.performanceTable);
      initializeScales();
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      }, 100);
    }

    function getDataSourcesForScaleSliders() {
      return ($scope.hasMissingValues || $scope.areTooManyDataSourcesSelected) ?
        [] : _.keys(_.pickBy($scope.subProblemState.dataSourceInclusions));
    }

    function initializeScales() {
      $scope.scales =  $scope.workspaceSettings.showPercentages ?  angular.copy($scope.originalScales.basePercentified) : angular.copy($scope.originalScales.base);
      var filteredPerformanceTable = SubProblemService.excludeDeselectedAlternatives($scope.problem.performanceTable, $scope.subProblemState.alternativeInclusions);
      var stateAndChoices = ScaleRangeService.getScalesStateAndChoices($scope.scales, $scope.problem.criteria, filteredPerformanceTable);
      $scope.scalesState = stateAndChoices.scalesState;
      $scope.choices = stateAndChoices.choices;

      $scope.$watch('choices', function() {
        $scope.invalidSlider = SubProblemService.hasInvalidSlider($scope.scalesDataSources, $scope.choices, $scope.scalesState);
      }, true);
    }

    function reset() {
      var titleCache = $scope.subProblemState.title;
      var newSubProblem = {
        definition: {
          excludedCriteria: [],
          excludedAlternatives: [],
          excludedDataSources: []
        }
      };
      initSubProblem(newSubProblem, problem);
      $scope.subProblemState.title = titleCache;
    }

    // private functions
    function checkDuplicateTitle(title) {
      $scope.isTitleDuplicate = _.find($scope.subProblems, ['title', title]);
    }

  };
  return dependencies.concat(CreateSubProblemController);
});
