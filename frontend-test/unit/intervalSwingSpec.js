'use strict';
define(['angular',
    'angular-mocks',
    'mcda/preferences/preferences'
  ],
  function() {
    describe('IntervalSwingHandler', function() {
      beforeEach(module('elicit.preferences'));
      beforeEach(module('elicit.taskDependencies'));

      function initializeScope($controller, $rootScope, TaskDependencies,  problem) {
        var scope, state;
        scope = $rootScope.$new();

        var scenario = {
          state: {
            problem: problem,
            prefs: [{
              type: 'ordinal',
              criteria: ['Prox DVT', 'Bleed']
            }, {
              type: 'ordinal',
              criteria: ['Bleed', 'Dist DVT']
            }]
          },
          $save: function() {}
        };
        scope.scenario = scenario;
        scope.aggregateState = scenario.state;
        var task = {
          requires: [],
          resets: []
        };

        state = jasmine.createSpyObj('$state', ['go']);

        $controller('IntervalSwingController', {
          $scope: scope,
          $stateParams: {},
          $state: state,
          currentScenario: scenario,
          taskDefinition: TaskDependencies.extendTaskDefinition(task),
          mcdaRootPath: 'some mcda rootPath'
        });
        return scope;
      }

      describe('initialize', function() {
        it('should start comparing the first two criteria', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          var problem = scope.state.problem;
          expect(scope.state.criterionA).toEqual('Prox DVT');
          expect(scope.state.criterionB).toEqual('Bleed');
          expect(scope.state.choice.lower).toEqual(PartialValueFunctionService.best(problem.criteria['Prox DVT']));
          expect(scope.state.choice.upper).toEqual(PartialValueFunctionService.worst(problem.criteria['Prox DVT']));
          expect(scope.state.worst()).toEqual(PartialValueFunctionService.worst(problem.criteria['Prox DVT']));
          expect(scope.state.best()).toEqual(PartialValueFunctionService.best(problem.criteria['Prox DVT']));
        }));


        it('should sort the worst and best values', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var problem = exampleProblem();
          problem.criteria['Prox DVT'].pvf.direction = 'increasing';
          var scope = initializeScope($controller, $rootScope, TaskDependencies, problem);

          expect(scope.state.choice.lower).toEqual(PartialValueFunctionService.worst(problem.criteria['Prox DVT']));
          expect(scope.state.worst()).toEqual(PartialValueFunctionService.worst(problem.criteria['Prox DVT']));
          expect(scope.state.best()).toEqual(PartialValueFunctionService.best(problem.criteria['Prox DVT']));
        }));

        it('should make best() and worst() functions of choice', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.state.choice = {
            lower: 0.1,
            upper: 0.2
          };
          expect(scope.state.worst()).toEqual(0.2);
          expect(scope.state.best()).toEqual(0.1);
        }));

        it('should set the progress information', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          expect(scope.state.step).toEqual(1);
          expect(scope.state.total).toEqual(2);
        }));
      });

      describe('validChoice', function() {
        it('should check that the worst value is not set to the worst value of the higher weighted criterion ', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.state.choice.lower = 0;
          scope.state.choice.upper = 0.25;
          expect(scope.canProceed(scope.state)).toEqual(false);
          scope.state.choice.upper = 0.2;
          expect(scope.canProceed(scope.state)).toEqual(true);
          scope.state.choice.lower = 0.2;
          expect(scope.canProceed(scope.state)).toEqual(true);
        }));
      });

      describe('nextState', function() {
        it('should transition to the next two criteria', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          var problem = scope.state.problem;
          scope.state.choice.upper = 0.2; // make the upper bound a valid choice
          scope.nextStep(scope.state);
          expect(scope.state.criterionA).toEqual('Bleed');
          expect(scope.state.criterionB).toEqual('Dist DVT');
          expect(scope.state.choice.lower).toEqual(PartialValueFunctionService.best(problem.criteria.Bleed));
          expect(scope.state.choice.upper).toEqual(PartialValueFunctionService.worst(problem.criteria.Bleed));
        }));

        it('should transition to done when criteria run out', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.state.choice.upper = 0.2;
          scope.nextStep(scope.state);
          scope.state.choice.upper = 0.2;
          scope.nextStep(scope.state);
          expect(scope.state.type).toEqual('done');
        }));

        it('should set the title', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.state.choice.upper = 0.2;
          scope.nextStep(scope.state);
          expect(scope.state.step).toEqual(2);
          expect(scope.state.total).toEqual(2);
        }));

        it('should store the preference information', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.state.choice.lower = 0.11;
          scope.state.choice.upper = 0.13;
          scope.nextStep(scope.state);

          expect(scope.state.prefs[2].type).toEqual('ratio bound');
          expect(scope.state.prefs[2].criteria).toEqual(['Prox DVT', 'Bleed']);
          expect(scope.state.prefs[2].bounds.length).toEqual(2);
          expect(scope.state.prefs[2].bounds[0]).toBeCloseTo(1.79);
          expect(scope.state.prefs[2].bounds[1]).toBeCloseTo(2.08);

          scope.state.choice.lower = 0.04;
          scope.state.choice.upper = 0.05;

          spyOn(scope.scenario, '$save');
          scope.save(scope.state);
          expect(scope.scenario.$save).toHaveBeenCalled();

          var problem = exampleProblem();
          problem.criteria['Prox DVT'].pvf.direction = 'increasing';
          scope = initializeScope($controller, $rootScope, TaskDependencies, problem);

          scope.state.choice.lower = 0.12;
          scope.state.choice.upper = 0.14;
          scope.nextStep(scope.state);
          expect(scope.state.prefs[2].type).toEqual('ratio bound');
          expect(scope.state.prefs[2].criteria).toEqual(['Prox DVT', 'Bleed']);
          expect(scope.state.prefs[2].bounds.length).toEqual(2);
          expect(scope.state.prefs[2].bounds[0]).toBeCloseTo(1.79);
          expect(scope.state.prefs[2].bounds[1]).toBeCloseTo(2.08);
        }));

        it('should sort the worst and best values', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
          var problem = exampleProblem();
          problem.criteria['Prox DVT'].pvf.direction = 'increasing';
          var scope = initializeScope($controller, $rootScope, TaskDependencies, problem);
          expect(scope.state.choice.lower).toEqual(PartialValueFunctionService.worst(problem.criteria['Prox DVT']));
          expect(scope.state.worst()).toEqual(PartialValueFunctionService.worst(problem.criteria['Prox DVT']));
          expect(scope.state.best()).toEqual(PartialValueFunctionService.best(problem.criteria['Prox DVT']));
        }));
      });
    });
  });
