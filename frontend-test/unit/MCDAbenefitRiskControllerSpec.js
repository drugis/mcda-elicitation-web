'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/benefitRisk/benefitRisk'], (_, angular) => {
  describe('MCDA benefit-risk controller', () => {
    var scope;
    var transitions = jasmine.createSpyObj('$transitions', ['onStart']);
    var stateMock = jasmine.createSpyObj('$state', ['go']);
    var stateParams;
    var modalMock = jasmine.createSpyObj('$modal', ['open']);
    var McdaBenefitRiskService = jasmine.createSpyObj('McdaBenefitRiskService', ['newScenarioAndGo', 'copyScenarioAndGo']);
    var Tasks = {
      available: [{
        id: 'smaa-results'
      }, {
        id: 'evidence'
      }]
    };
    var TaskDependencies = jasmine.createSpyObj('TaskDependencies', ['isAccessible']);
    var ScenarioResource = jasmine.createSpyObj('ScenarioResource', ['get', 'save', 'query']);
    var WorkspaceService = jasmine.createSpyObj('WorkspaceService', [
      'getObservedScales',
      'filterScenariosWithResults',
      'buildAggregateState',
      'percentifyScales',
      'percentifyCriteria',
      'dePercentifyCriteria',
      'mergeBaseAndSubProblem',
      'setDefaultObservedScales',
      'hasNoStochasticResults',
      'checkForMissingValuesInPerformanceTable'
    ]);
    var WorkspaceSettingsService = jasmine.createSpyObj('WorkspaceSetttingsService', ['usePercentage']);
    var EffectsTableService = jasmine.createSpyObj('EffectsTableService', ['createEffectsTableInfo']);
    var subProblems;
    var currentSubProblem = {
      id: 'subProblemId'
    };
    var currentScenario = { id: 'currentScenarioId' };
    var scenariosWithResults = [currentScenario];
    var scenarios = [{ id: 'scenarioId' }, currentScenario];
    var isMcdaStandalone = true;
    var workspace = {
      id: 'workspaceId',
      problem: {
        id: 'problemId'
      }
    };
    var baseAggregateState = {
      problem: {
        criteria: {},
        performanceTable: [{
          performance: {
            type: 'empty'
          }
        }]
      }
    };
    var observedScalesDefer;
    var effectsTableInfo = {
      id: 'effectsTableInfo'
    };
    var observedScales = {
      id: 'observedScales'
    };

    beforeEach(angular.mock.module('elicit.benefitRisk'));

    beforeEach(inject(($q) => {
      WorkspaceService.filterScenariosWithResults.and.returnValue(scenariosWithResults);
      WorkspaceService.buildAggregateState.and.returnValue(angular.copy(baseAggregateState));
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
      transitions.onStart.and.returnValue(() => { });
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

      it('should place a copyScenario function which opens a modal on the scope.', () => {
        expect(modalMock.open).not.toHaveBeenCalled();
        scope.copyScenario();
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
    });

    describe('once the scales have been loaded', () => {
      var percentifiedScales = { id: 'percentifiedScales' };
      var percentifiedCriteria = { id: 'percentifiedCriteria' };
      var baseProblemWithScales = _.extend({}, baseAggregateState.problem, {
        criteria: percentifiedCriteria
      });
      var stateWithPercentifiedCriteria = _.merge({}, baseAggregateState, {
        problem: {
          criteria: percentifiedCriteria
        }
      });
      WorkspaceService.percentifyScales.and.returnValue(percentifiedScales);
      WorkspaceService.setDefaultObservedScales.and.returnValue(baseProblemWithScales);
      WorkspaceService.percentifyCriteria.and.returnValue(stateWithPercentifiedCriteria);
      WorkspaceService.percentifyScales.and.returnValue(percentifiedScales);
      WorkspaceService.dePercentifyCriteria.and.returnValue(baseAggregateState);
      WorkspaceService.setDefaultObservedScales.and.returnValue(baseAggregateState.problem);

      beforeEach(() => {
        observedScalesDefer.resolve(observedScales);
        TaskDependencies.isAccessible.calls.reset();
        scope.$apply();
      });

      it('should populate the scope with scenarios', () => {
        expect(scope.scenarios).toBe(scenarios);
        expect(scope.scenario).toBe(currentScenario);
        expect(scope.scenariosWithResults).toBe(scenariosWithResults);
        expect(scope.isDuplicateScenarioTitle).toBe(false);
      });

      it('should percentify the scales and properly initalise base- and regular aggregate state', (done) => {
        observedScalesDefer.promise.then(() => {
          expect(scope.workspace.scales.base).toBe(observedScales);
          expect(scope.workspace.scales.basePercentified).toBe(percentifiedScales);
          expect(_.omit(scope.aggregateState, ['percentified', 'dePercentified'])).toEqual(baseAggregateState);
          expect(scope.aggregateState.percentified).toEqual(stateWithPercentifiedCriteria);
          expect(scope.aggregateState.dePercentified).toEqual(baseAggregateState);
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

    describe('when the aggregate state changes', () => {
      beforeEach(() => {
        WorkspaceService.hasNoStochasticResults.calls.reset();
        WorkspaceService.hasNoStochasticResults.and.returnValue(true);
        scope.aggregateState = { id: 'changed' };
        scope.$apply();
      });

      it('should check whether there are stochastic results', () => {
        expect(WorkspaceService.hasNoStochasticResults).toHaveBeenCalled();
      });
    });

    describe('when a $destroy event triggers', () => {
      it('should call deregisterTransitionListener', () => {
        spyOn(scope, 'deregisterTransitionListener');
        expect(scope.deregisterTransitionListener).not.toHaveBeenCalled();
        scope.$broadcast('$destroy');
        scope.$apply();
        expect(scope.deregisterTransitionListener).toHaveBeenCalled();
      });
    });
  });
});
