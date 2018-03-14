'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$transitions', '$state', '$stateParams', '$modal',
    'Tasks',
    'TaskDependencies',
    'ScenarioResource',
    'WorkspaceService',
    'subProblems',
    'currentSubProblem',
    'scenarios',
    'currentScenario',
    'mcdaRootPath'
  ];

  function MCDABenefitRiskController($scope, $transitions, $state, $stateParams, $modal,
    Tasks,
    TaskDependencies,
    ScenarioResource,
    WorkspaceService,
    subProblems,
    currentSubProblem,
    scenarios,
    currentScenario,
    mcdaRootPath
  ) {
    // functions
    $scope.forkScenario = forkScenario;
    $scope.newScenario = newScenario;
    $scope.scenarioChanged = scenarioChanged;

    // init
    var baseProblem = $scope.workspace.problem;
    var deregisterTransitionListener;
    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};
    $scope.selections = {};
    $scope.scenarios = scenarios;
    $scope.scenariosWithResults = WorkspaceService.filterScenariosWithResults(baseProblem, currentSubProblem, scenarios);
    $scope.scenario = currentScenario;
    $scope.isDuplicateScenarioTitle = false;
    $scope.aggregateState = WorkspaceService.buildAggregateState(baseProblem, currentSubProblem, currentScenario);
    $scope.subProblems = subProblems;
    $scope.subProblem = currentSubProblem;
    $scope.workspace.$$valueTree = WorkspaceService.buildValueTree(baseProblem);
    $scope.workspace.scales = {};
    $scope.workspace.scales.theoreticalScales = WorkspaceService.buildTheoreticalScales(baseProblem);
    $scope.showStudyData = {value:false}; // true : study data, false : exact/relative values
    determineActiveTab();
    createPerformanceTableInfo();

    $scope.$on('$destroy', deregisterTransitionListener);

    $scope.$watch('scenario.state', updateTaskAccessibility);
    $scope.$on('elicit.resultsAccessible', function(event, scenario) {
      $scope.aggregateState = WorkspaceService.buildAggregateState(baseProblem, currentSubProblem, scenario);
      $scope.scenario = scenario;
      if ($scope.workspace.scales.observed) {
        $scope.aggregateState.problem = WorkspaceService.setDefaultObservedScales($scope.aggregateState.problem, $scope.workspace.scales.observed);
      }
      updateTaskAccessibility();
      hasNoStochasticResults();
      ScenarioResource.query(_.omit($stateParams, ['id'])).$promise.then(function(scenarios) {
        $scope.scenarios = scenarios;
        $scope.scenariosWithResults = WorkspaceService.filterScenariosWithResults(baseProblem, currentSubProblem, scenarios);
      });
    });

    $scope.scalesPromise = WorkspaceService.getObservedScales($scope, baseProblem).then(function(observedScales) {
      $scope.workspace.scales.observed = observedScales;
      $scope.aggregateState.problem = WorkspaceService.setDefaultObservedScales($scope.aggregateState.problem, observedScales);
      updateTaskAccessibility();
      return $scope.workspace.scales;
    });

    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});

    deregisterTransitionListener = $transitions.onStart({}, function(transition) {
      setActiveTab(transition.to().name, transition.to().name);
    });

    $scope.$watch('aggregateState', hasNoStochasticResults, true);

    function hasNoStochasticResults() {
      var isAllExact = _.reduce($scope.aggregateState.problem.performanceTable, function(accum, tableEntry) {
        return accum && (tableEntry.performance.type === 'exact');
      }, true);
      var isExactSwing = _.find($scope.aggregateState.prefs, ['type', 'exact swing']);
      $scope.noStochasticResults = isAllExact && isExactSwing;
    }

    function getTask(taskId) {
      return _.find(Tasks.available, function(task) {
        return task.id === taskId;
      });
    }

    function determineActiveTab() {
      setActiveTab($state.current.name, 'evidence');
    }

    function setActiveTab(activeStateName, defaultStateName) {
      var activeTask = getTask(activeStateName);
      if (activeTask) {
        $scope.activeTab = activeTask.activeTab;
      } else {
        $scope.activeTab = defaultStateName;
      }
    }

    function updateTaskAccessibility() {
      $scope.tasksAccessibility = {
        preferences: TaskDependencies.isAccessible($scope.tasks.preferences, $scope.aggregateState).accessible,
        results: TaskDependencies.isAccessible($scope.tasks.results, $scope.aggregateState).accessible
      };
    }

    function redirect(scenarioId, stateName) {
      var newState = _.omit($stateParams, 'id');
      newState.id = scenarioId;
      $state.go(stateName, newState, {
        reload: true
      });
    }

    function forkScenario() {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/preferences/newScenario.html',
        controller: 'NewScenarioController',
        resolve: {
          scenarios: function() {
            return $scope.scenarios;
          },
          type: function() {
            return 'Fork';
          },
          callback: function() {
            return function(newTitle) {
              ScenarioResource.get($stateParams, function(scenario) { // reload because child scopes may have changed scenario
                var newScenario = {
                  title: newTitle,
                  state: scenario.state,
                  subProblemId: $scope.subProblem.id
                };
                ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
                  redirect(savedScenario.id, $state.current.name);
                });
              });
            };
          }
        }
      });
    }

    function newScenario() {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/preferences/newScenario.html',
        controller: 'NewScenarioController',
        resolve: {
          scenarios: function() {
            return $scope.scenarios;
          },
          type: function() {
            return 'New';
          },
          callback: function() {
            return function(newTitle) {
              var mergedProblem = WorkspaceService.mergeBaseAndSubProblem($scope.workspace.problem, $scope.subProblem.definition);
              var newScenario = {
                title: newTitle,
                state: {
                  problem: WorkspaceService.reduceProblem(mergedProblem)
                },
                workspace: $scope.workspace.id,
                subProblemId: $scope.subProblem.id
              };
              ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
                var newStateName = $scope.tasksAccessibility.preferences ? 'preferences' : 'problem';
                redirect(savedScenario.id, newStateName);
              });
            };
          }
        }
      });
    }

    function scenarioChanged(newScenario) {
      if (!newScenario) {
        return; // just a title edit
      } else {
        if ($state.current.name === 'smaa-results') {

          $state.go('smaa-results', {
            workspaceId: $scope.workspace.id,
            problemId: $scope.subProblem.id,
            id: newScenario.id
          });
        } else if ($state.current.name === 'deterministic-results') {
          $state.go('deterministic-results', {
            workspaceId: $scope.workspace.id,
            problemId: $scope.subProblem.id,
            id: newScenario.id
          });
        } else {
          $state.go('preferences', {
            workspaceId: $scope.workspace.id,
            problemId: $scope.subProblem.id,
            id: newScenario.id
          });
        }
      }
    }

    function createPerformanceTableInfo() {
      $scope.effectsTableInfo = _.reduce($scope.aggregateState.problem.performanceTable, function(accum, tableEntry) {
        if (accum[criterionId]) { return accum; }
        var criterionId = tableEntry.criterion;
        if (tableEntry.performance.type === 'exact') {
          accum[criterionId] = {
            distributionType: 'exact',
            hasStudyData: false
          };
        } else if (tableEntry.alternative) {
          accum[criterionId] = {
            distributionType: tableEntry.performance.type,
            hasStudyData: true,
            studyDataLabels: _($scope.aggregateState.problem.performanceTable)
              .filter(function(tableEntry) {
                return criterionId === tableEntry.criterion;
              })
              .reduce(function(accum, entryForCriterion) {
                var label;
                var parameters = entryForCriterion.performance.parameters;
                switch (entryForCriterion.performance.type) {
                  case 'dt':
                    label = parameters.mu + ' ± ' + parameters.stdErr + ' (' + (parameters.dof + 1) + ')';
                    break;
                  case 'dnorm':
                    label = parameters.mu + ' ± ' + parameters.sigma;
                    break;
                  case 'dbeta':
                    label = (parameters.alpha - 1) + ' / ' + (parameters.beta + parameters.alpha - 2);
                    break;
                  case 'dsurv':
                    label = (parameters.alpha - 0.001) + ' / ' + (parameters.beta - 0.001);
                    break;
                }
                accum[entryForCriterion.alternative] = label;
                return accum;
              }, {})
          };
        } else {
          accum[tableEntry.criterion] = {
            distributionType: 'relative',
            hasStudyData: false
          };
        }
        return accum;
      }, {});
      $scope.studyDataAvailable = _.find($scope.effectsTableInfo, function(infoEntry) {
        return infoEntry.distributionType !== 'exact' && infoEntry.distributionType !== 'relative';
      });
    }
  }
  return dependencies.concat(MCDABenefitRiskController);
});