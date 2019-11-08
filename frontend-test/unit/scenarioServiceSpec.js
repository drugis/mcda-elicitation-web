'use strict';
define(['angular', 'angular-mocks'], (angular) => {
  describe('scenarioService', () => {

    var scenarioService,
      q,
      rootScope,
      state = jasmine.createSpyObj('$state', ['go']),
      stateParams = {
        id: 'stateParams',
        otherParam: 'something'
      },
      scenarioResourceMock = jasmine.createSpyObj('ScenarioResource', ['get', 'save']),
      workspaceServiceMock = jasmine.createSpyObj('WorkspaceService', ['mergeBaseAndSubProblem', 'reduceProblem']);

    beforeEach(() => {
      angular.mock.module('elicit.preferences', ($provide) => {
        $provide.value('$state', state);
        $provide.value('$stateParams', stateParams);
        $provide.value('ScenarioResource', scenarioResourceMock);
        $provide.value('WorkspaceService', workspaceServiceMock);
      });
    });

    beforeEach(inject(($rootScope, $q, ScenarioService) => {
      q = $q;
      rootScope = $rootScope;
      scenarioService = ScenarioService;
    }));

    describe('copyScenarioAndGo', () => {
      var sourceScenario = {
        state: {
          id: 'sourceState'
        }
      };
      var savedScenario = {
        id: 'savedScenario'
      };

      beforeEach(() => {
        scenarioResourceMock.get.and.returnValue({
          $promise: q.resolve(sourceScenario)
        });
        scenarioResourceMock.save.and.returnValue({
          $promise: q.resolve(savedScenario)
        });
        state.current = {
          name: 'currentState'
        };
      });

      afterEach(() => {
        delete state.current;
        scenarioResourceMock.save.calls.reset();
      });

      it('should get the source scenario and create and save a new one with the same state and parent subproblem, then redirect to current state', (done) => {
        var newTitle = 'newTitle';
        var subproblem = {
          id: 'subProblemId'
        };

        scenarioService.copyScenarioAndGo(newTitle, subproblem).then(() => {
          expect(scenarioResourceMock.get).toHaveBeenCalledWith(stateParams);
          expect(scenarioResourceMock.save).toHaveBeenCalledWith({
            otherParam: 'something'
          }, {
            title: newTitle,
            state: sourceScenario.state,
            subProblemId: subproblem.id
          });
          expect(state.go).toHaveBeenCalledWith(state.current.name, {
            otherParam: 'something',
            id: savedScenario.id
          }, { reload: true });
          done();
        });
        rootScope.$apply();
      });
    });

    describe('newScenarioAndGo', () => {
      var savedScenario = {
        id: 'savedScenario'
      };
      var mergedProblem = {
        id: 'mergedProblem'
      };
      var reducedProblem = {
        id: 'reducedProblem'
      };

      beforeEach(() => {
        workspaceServiceMock.mergeBaseAndSubProblem.and.returnValue(mergedProblem);
        workspaceServiceMock.reduceProblem.and.returnValue(reducedProblem);
        scenarioResourceMock.save.and.returnValue({
          $promise: q.resolve(savedScenario)
        });
      });

      afterEach(() => {
        scenarioResourceMock.save.calls.reset();
      });

      it('should create a new, clean, scenario, based on the problem and current subproblem, save the new scenario, and navigate to it', (done) => {
        var workspace = {
          problem: {},
          id: 'workspaceId'
        };
        var subproblem = {
          definition: {},
          id: 'subProblemId'
        };
        var newScenario = {
          title: 'newTitle',
          state: {
            problem: {
              id: 'reducedProblem'
            }
          },
          workspace: workspace.id,
          subProblemId: subproblem.id
        };
        scenarioService.newScenarioAndGo('newTitle', workspace, subproblem).then(() => {
          expect(scenarioResourceMock.save).toHaveBeenCalledWith({
            otherParam: 'something'
          }, newScenario);
          expect(state.go).toHaveBeenCalledWith('preferences', {
            otherParam: 'something',
            id: savedScenario.id
          }, { reload: true });
          done();
        });
        rootScope.$apply();
      });
    });
  });

});
