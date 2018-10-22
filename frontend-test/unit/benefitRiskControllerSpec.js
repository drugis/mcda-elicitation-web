'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/benefitRisk/benefitRisk'], (_, angular) => {
  describe('MCDA benefit-risk controller', () => {

    var scope,
      transitions = jasmine.createSpyObj('$transitions', ['onStart']),
      stateMock = jasmine.createSpyObj('$state', ['go']),
      stateParams,
      modalMock = jasmine.createSpyObj('$modal', ['open']),
      McdaBenefitRiskService = jasmine.createSpyObj('McdaBenefitRiskService', ['newScenarioAndGo', 'forkScenarioAndGo']),
      Tasks = {
        available: [{
          id: 'smaa-results'
        }, {
          id: 'evidence'
        }]
      },
      TaskDependencies = jasmine.createSpyObj('TaskDependencies', ['isAccessible']),
      ScenarioResource = jasmine.createSpyObj('ScenarioResource', ['get', 'save', 'query']),
      WorkspaceService = jasmine.createSpyObj('WorkspaceService', [
        'getObservedScales',
        'filterScenariosWithResults',
        'buildAggregateState',
        'percentifyScales',
        'percentifyCriteria',
        'mergeBaseAndSubProblem',
        'setDefaultObservedScales',
        'hasNoStochasticResults'
      ]),
      WorkspaceSettingsService = jasmine.createSpyObj('WorkspaceSetttingsService', ['usePercentage']),
      EffectsTableService = jasmine.createSpyObj('EffectsTableService', ['createEffectsTableInfo']),
      subProblems,
      currentSubProblem = {
        id: 'subProblemId'
      },
      currentScenario = { id: 'currentScenarioId' },
      scenariosWithResults = [currentScenario],
      scenarios = [{ id: 'scenarioId' }, currentScenario],
      isMcdaStandalone = true,
      workspace = {
        id: 'workspaceId',
        problem: {
          id: 'problemId'
        }
      },
      baseAggregateState = {
        problem: {
          criteria: {},
          performanceTable: [{
            performance: {
              type: 'empty'
            }
          }]
        }
      },
      observedScalesDefer,
      effectsTableInfo = {
        id: 'effectsTableInfo'
      };

    beforeEach(angular.mock.module('elicit.benefitRisk'));

    beforeEach(inject(($q) => {
      WorkspaceService.filterScenariosWithResults.and.returnValue(scenariosWithResults);
      WorkspaceService.buildAggregateState.and.returnValue(baseAggregateState);
      stateMock.current = {
        name: 'evidence'
      };
      observedScalesDefer = $q.defer();
      WorkspaceService.getObservedScales.and.returnValue(observedScalesDefer.promise);
      TaskDependencies.isAccessible.and.returnValue({
        accessible: true
      });
      WorkspaceService.getObservedScales.calls.reset();
      ScenarioResource.query.and.returnValue({
        $promise: $q.resolve(scenarios)
      });
      EffectsTableService.createEffectsTableInfo.and.returnValue(effectsTableInfo);
    }));

    beforeEach(inject(($controller, $rootScope) => {
      scope = $rootScope.$new();

      scope.workspace = workspace;

      $controller('MCDABenefitRiskController', {
        $scope: scope,
        $transitions: transitions,
        $state: stateMock,
        $stateParams: stateParams,
        $modal: modalMock,
        McdaBenefitRiskService: McdaBenefitRiskService,
        Tasks: Tasks,
        TaskDependencies: TaskDependencies,
        ScenarioResource: ScenarioResource,
        WorkspaceService: WorkspaceService,
        WorkspaceSettingsService: WorkspaceSettingsService,
        EffectsTableService: EffectsTableService,
        subProblems: subProblems,
        currentSubProblem: currentSubProblem,
        scenarios: scenarios,
        currentScenario: currentScenario,
        isMcdaStandalone: isMcdaStandalone,
      });
    }));

    describe('initially', () => {
      beforeEach(() => {
        modalMock.open.calls.reset();
        TaskDependencies.isAccessible.calls.reset();
        scope.$apply();
      });
      it('should place a forkScenario function which opens a modal on the scope.', () => {
        expect(modalMock.open).not.toHaveBeenCalled();
        scope.forkScenario();
        expect(modalMock.open).toHaveBeenCalled();
      });
      it('should place a newScenario function which opens a modal on the scope.', () => {
        expect(modalMock.open).not.toHaveBeenCalled();
        scope.newScenario();
        expect(modalMock.open).toHaveBeenCalled();
      });
      describe('should place scenarioChanged on the scope', () => {
        beforeEach(() => {
          stateMock.go.calls.reset();
        });
        it('which should be a function', () => {
          expect(typeof scope.scenarioChanged).toBe('function');
        });
        it('which should do nothing if there is no new scenario', () => {
          scope.scenarioChanged();
          expect(stateMock.go).not.toHaveBeenCalled();
        });
        it('which should go to the correct state for smaa-results', () => {
          var oldStateCurrent = stateMock.current;
          stateMock.current = {
            name: 'smaa-results'
          };
          var newScenario = {
            id: 'newScenarioId'
          };
          scope.scenarioChanged(newScenario);
          expect(stateMock.go).toHaveBeenCalledWith('smaa-results', {
            workspaceId: workspace.id,
            problemId: currentSubProblem.id,
            id: newScenario.id
          });
          stateMock.current = oldStateCurrent;
        });
        it('which should go to preferences by default', () => {
          var oldStateCurrent = stateMock.current;
          stateMock.current = {
            name: 'something-else'
          };
          var newScenario = {
            id: 'newScenarioId'
          };
          scope.scenarioChanged(newScenario);
          expect(stateMock.go).toHaveBeenCalledWith('preferences', {
            workspaceId: workspace.id,
            problemId: currentSubProblem.id,
            id: newScenario.id
          });
          stateMock.current = oldStateCurrent;
        });
      });
      it('should populate the scope with scenarios', () => {
        expect(scope.scenarios).toBe(scenarios);
        expect(scope.scenario).toBe(currentScenario);
        expect(scope.scenariosWithResults).toBe(scenariosWithResults);
        expect(scope.isDuplicateScenarioTitle).toBe(false);
      });
      it('should place the tasks on the scope', () => {
        expect(scope.tasks).toEqual({
          'smaa-results': {
            id: 'smaa-results'
          },
          evidence: {
            id: 'evidence'
          }
        });
      });
      it('should retrieve the observed scales', () => {
        expect(WorkspaceService.getObservedScales).toHaveBeenCalledWith(workspace.problem);
      });
      it('should build a base aggregate state and place it on the scope', () => {
        expect(scope.baseAggregateState).toBe(baseAggregateState);
      });
      it('should set the task accessibility', () => {
        expect(TaskDependencies.isAccessible).toHaveBeenCalledTimes(2);
        expect(scope.tasksAccessibility).toEqual({
          preferences: true,
          results: true
        });
      });
      it('should set the effects table info on the scope', () => {
        expect(scope.effectsTableInfo).toBe(effectsTableInfo);
      });
      it('should check for missing performance values', () => {
        expect(scope.hasMissingValues).toBeTruthy();
      });
    });
    describe('once the scales have been loaded', () => {
      var observedScales = {
        id: 'observedScales'
      };
      var percentifiedScales = { id: 'percentifiedScales' };
      var percentifiedCriteria = { id: 'percentifiedCriteria' };
      var baseProblemWithScales = _.extend({}, baseAggregateState.problem, {
        criteria: percentifiedCriteria
      });
      beforeEach(() => {
        observedScalesDefer.resolve(observedScales);
      });
      describe('if percentages should be used', () => {
        var stateWithPercentifiedCriteria = _.merge({}, baseAggregateState, {
          problem: {
            criteria: percentifiedCriteria
          }
        });

        beforeEach(() => {
          TaskDependencies.isAccessible.calls.reset();
          WorkspaceSettingsService.usePercentage.and.returnValue(true);
          WorkspaceService.percentifyScales.and.returnValue(percentifiedScales);
          WorkspaceService.percentifyCriteria.and.returnValue(stateWithPercentifiedCriteria);
          WorkspaceService.setDefaultObservedScales.and.returnValue(baseProblemWithScales);
          scope.$apply();
        });
        it('should percentify the scales and properly initalise base- and regular aggregate state', (done) => {
          observedScalesDefer.promise.then(() => {
            expect(scope.workspace.scales.base).toBe(observedScales);
            expect(scope.workspace.scales.observed).toBe(percentifiedScales);
            expect(scope.workspace.scales.basePercentified).toBe(percentifiedScales);
            expect(scope.aggregateState).toEqual(stateWithPercentifiedCriteria);
            expect(scope.baseAggregateState).toEqual(stateWithPercentifiedCriteria);
            done();
          });
          scope.$apply();
        });
        it('should update the task accessibility', () => {
          expect(TaskDependencies.isAccessible).toHaveBeenCalledTimes(4);
          expect(scope.tasksAccessibility).toEqual({
            preferences: true,
            results: true
          });
        });
      });
      describe('if percentages should not be used', () => {
        var problemWithBaseCriteria = baseAggregateState;
        beforeEach(() => {
          TaskDependencies.isAccessible.calls.reset();
          WorkspaceSettingsService.usePercentage.and.returnValue(false);
          WorkspaceService.percentifyScales.and.returnValue(percentifiedScales);
          WorkspaceService.setDefaultObservedScales.and.returnValue(problemWithBaseCriteria.problem);
          scope.$apply();
        });
        it('should set the scales and properly initalise base- and regular aggregate state', (done) => {
          observedScalesDefer.promise.then(() => {
            expect(scope.workspace.scales.base).toBe(observedScales);
            expect(scope.workspace.scales.observed).toBe(observedScales);
            expect(scope.workspace.scales.basePercentified).toEqual(percentifiedScales);
            expect(scope.aggregateState).toEqual(problemWithBaseCriteria);
            expect(scope.baseAggregateState).toEqual(problemWithBaseCriteria);
            done();
          });
          scope.$apply();
        });
        it('should update the task accessibility', () => {
          expect(TaskDependencies.isAccessible).toHaveBeenCalledTimes(4);
          expect(scope.tasksAccessibility).toEqual({
            preferences: true,
            results: true
          });
        });
      });
    });
    describe('when the aggregate state changes', () => {
      beforeEach(() => {
        WorkspaceService.hasNoStochasticResults.calls.reset();
        WorkspaceService.hasNoStochasticResults.and.returnValue(true);
        scope.aggregateState = { id: 'changed' };
        scope.$apply();
      });
      it('should check whether there are stochastic results', () => {
        expect(WorkspaceService.hasNoStochasticResults).toHaveBeenCalled();
        expect(scope.hasNoStochasticResults).toBe(true);
      });
    });
    describe('when a settings change event triggers', () => {
      it('should update the scales', () => {
        spyOn(scope, 'updateScales');
        expect(scope.updateScales).not.toHaveBeenCalled();
        scope.$broadcast('elicit.settingsChanged');
        scope.$apply();
        expect(scope.updateScales).toHaveBeenCalled();
      });
    });
    describe('when a resultsAccessible event triggers', () => {
      it('should update the state', () => {
        spyOn(scope, 'updateState');
        expect(scope.updateState).not.toHaveBeenCalled();
        scope.$broadcast('elicit.resultsAccessible');
        scope.$apply();
        expect(scope.updateState).toHaveBeenCalled();
      });
    });
  });
});
