define(['angular',
    'angular-mocks',
    'mcda/controllers/intervalSwing',
    'mcda/services/pataviService'
  ],
  function(angular, IntervalSwingHandler) {
    describe('IntervalSwingHandler', function() {
      beforeEach(module('elicit.controllers'));
      beforeEach(module('elicit.taskDependencies'));
      beforeEach(module('elicit.pvfService'));

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
          $save: function(state) {}
        };
        scope.scenario = scenario;

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
        it('should start comparing the first two criteria', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          var problem = scope.state.problem;
          expect(scope.state.criterionA).toEqual('Prox DVT');
          expect(scope.state.criterionB).toEqual('Bleed');
          expect(scope.state.choice.lower).toEqual(PartialValueFunction.best(problem.criteria['Prox DVT']));
          expect(scope.state.choice.upper).toEqual(PartialValueFunction.worst(problem.criteria['Prox DVT']));
          expect(scope.state.worst()).toEqual(PartialValueFunction.worst(problem.criteria['Prox DVT']));
          expect(scope.state.best()).toEqual(PartialValueFunction.best(problem.criteria['Prox DVT']));
        }));


        it('should sort the worst and best values', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var problem = exampleProblem();
          problem.criteria['Prox DVT'].pvf.direction = 'increasing';
          var scope = initializeScope($controller, $rootScope, TaskDependencies, problem);

          expect(scope.state.choice.lower).toEqual(PartialValueFunction.worst(problem.criteria['Prox DVT']));
          expect(scope.state.worst()).toEqual(PartialValueFunction.worst(problem.criteria['Prox DVT']));
          expect(scope.state.best()).toEqual(PartialValueFunction.best(problem.criteria['Prox DVT']));
        }));

        it('should make best() and worst() functions of choice', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.state.choice = {
            lower: 0.1,
            upper: 0.2
          };
          expect(scope.state.worst()).toEqual(0.2);
          expect(scope.state.best()).toEqual(0.1);
        }));

        it('should set the progress information', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          expect(scope.state.step).toEqual(1);
          expect(scope.state.total).toEqual(2);
        }));
      });

      describe('validChoice', function() {
        it('should check that lower < upper', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.state.choice.lower = 0.2;
          scope.state.choice.upper = 0.1;
          expect(scope.canProceed(scope.state)).toEqual(false);
          scope.state.choice.upper = 0.2;
          expect(scope.canProceed(scope.state)).toEqual(false);
          scope.state.choice.upper = 0.21;
          expect(scope.canProceed(scope.state)).toEqual(true);
        }));

        it('should check that the choice is contained in the scale range', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.state.choice.lower = -0.05;
          scope.state.choice.upper = 0.26;
          expect(scope.canProceed(scope.state)).toEqual(false);
          scope.state.choice.upper = 0.25;
          expect(scope.canProceed(scope.state)).toEqual(false);
          scope.state.choice.lower = 0.0;
          expect(scope.canProceed(scope.state)).toEqual(true);
          scope.state.choice.upper = 0.26;
          expect(scope.canProceed(scope.state)).toEqual(false);
        }));
      });

      describe('nextState', function() {
        it('should transition to the next two criteria', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          var problem = scope.state.problem;
          scope.nextStep(scope.state);
          expect(scope.state.criterionA).toEqual('Bleed');
          expect(scope.state.criterionB).toEqual('Dist DVT');
          expect(scope.state.choice.lower).toEqual(PartialValueFunction.best(problem.criteria.Bleed));
          expect(scope.state.choice.upper).toEqual(PartialValueFunction.worst(problem.criteria.Bleed));
        }));

        it('should transition to done when criteria run out', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.nextStep(scope.state);
          scope.nextStep(scope.state);
          expect(scope.state.type).toEqual('done');
        }));

        it('should set the title', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());
          scope.nextStep(scope.state);
          expect(scope.state.step).toEqual(2);
          expect(scope.state.total).toEqual(2);
        }));

        it('should store the preference information', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
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

        it('should sort the worst and best values', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var problem = exampleProblem();
          problem.criteria['Prox DVT'].pvf.direction = 'increasing';
          var scope = initializeScope($controller, $rootScope, TaskDependencies, problem);
          expect(scope.state.choice.lower).toEqual(PartialValueFunction.worst(problem.criteria['Prox DVT']));
          expect(scope.state.worst()).toEqual(PartialValueFunction.worst(problem.criteria['Prox DVT']));
          expect(scope.state.best()).toEqual(PartialValueFunction.best(problem.criteria['Prox DVT']));
        }));
      });
    });
  });
