define(['angular',
    'angular-mocks',
    'mcda/controllers/intervalSwing',
    'mcda/controllers/partialValueFunction',
    'mcda/services/pataviService'
  ],
  function(angular, IntervalSwingHandler, PartialValueFunctionHandler) {
    describe('IntervalSwingHandler', function() {
      beforeEach(module('elicit.controllers'));
      beforeEach(module('elicit.taskDependencies'));
      beforeEach(module('elicit.pvfService'));
      beforeEach(module('elicit.pataviService'));

      function initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, problem) {
        var scope, state;
        scope = $rootScope.$new();

        var scenario = {
          state: PartialValueFunction.attach({
            problem: problem,
            prefs: [{
              type: 'ordinal',
              criteria: ['Prox DVT', 'Bleed']
            }, {
              type: 'ordinal',
              criteria: ['Bleed', 'Dist DVT']
            }]
          }),
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
          $state: state,
          currentScenario: scenario,
          taskDefinition: TaskDependencies.extendTaskDefinition(task),
          mcdaRootPath: 'some mcda rootPath'
        });
        return scope;
      }

      describe('initialize', function() {
        it('should start comparing the first two criteria', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          var problem = scope.currentStep.problem;
          expect(scope.currentStep.criterionA).toEqual('Prox DVT');
          expect(scope.currentStep.criterionB).toEqual('Bleed');
          expect(scope.currentStep.choice.lower).toEqual(problem.criteria['Prox DVT'].best());
          expect(scope.currentStep.choice.upper).toEqual(problem.criteria['Prox DVT'].worst());
          expect(scope.currentStep.worst()).toEqual(problem.criteria['Prox DVT'].worst());
          expect(scope.currentStep.best()).toEqual(problem.criteria['Prox DVT'].best());
        }));


        it('should sort the worst and best values', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var problem = exampleProblem();
          problem.criteria['Prox DVT'].pvf.direction = 'increasing';
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, problem);

          expect(scope.currentStep.choice.lower).toEqual(problem.criteria['Prox DVT'].worst());
          expect(scope.currentStep.worst()).toEqual(problem.criteria['Prox DVT'].worst());
          expect(scope.currentStep.best()).toEqual(problem.criteria['Prox DVT'].best());
        }));

        it('should make best() and worst() functions of choice', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          scope.currentStep.choice = {
            lower: 0.1,
            upper: 0.2
          };
          expect(scope.currentStep.worst()).toEqual(0.2);
          expect(scope.currentStep.best()).toEqual(0.1);
        }));

        it('should set the progress information', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          expect(scope.currentStep.step).toEqual(1);
          expect(scope.currentStep.total).toEqual(2);
        }));
      });

      describe('validChoice', function() {
        it('should check that lower < upper', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          scope.currentStep.choice.lower = 0.2;
          scope.currentStep.choice.upper = 0.1;
          expect(scope.canProceed(scope.currentStep)).toEqual(false);
          scope.currentStep.choice.upper = 0.2;
          expect(scope.canProceed(scope.currentStep)).toEqual(false);
          scope.currentStep.choice.upper = 0.21;
          expect(scope.canProceed(scope.currentStep)).toEqual(true);
        }));

        it('should check that the choice is contained in the scale range', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          scope.currentStep.choice.lower = -0.05;
          scope.currentStep.choice.upper = 0.26;
          expect(scope.canProceed(scope.currentStep)).toEqual(false);
          scope.currentStep.choice.upper = 0.25;
          expect(scope.canProceed(scope.currentStep)).toEqual(false);
          scope.currentStep.choice.lower = 0.0;
          expect(scope.canProceed(scope.currentStep)).toEqual(true);
          scope.currentStep.choice.upper = 0.26;
          expect(scope.canProceed(scope.currentStep)).toEqual(false);
        }));
      });

      describe('nextState', function() {
        it('should transition to the next two criteria', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          var problem = scope.currentStep.problem;
          scope.nextStep(scope.currentStep);
          expect(scope.currentStep.criterionA).toEqual('Bleed');
          expect(scope.currentStep.criterionB).toEqual('Dist DVT');
          expect(scope.currentStep.choice.lower).toEqual(problem.criteria.Bleed.best());
          expect(scope.currentStep.choice.upper).toEqual(problem.criteria.Bleed.worst());
        }));

        it('should transition to done when criteria run out', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          scope.nextStep(scope.currentStep);
          scope.nextStep(scope.currentStep);
          expect(scope.currentStep.type).toEqual('done');
        }));

        it('should set the title', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          scope.nextStep(scope.currentStep);
          expect(scope.currentStep.step).toEqual(2);
          expect(scope.currentStep.total).toEqual(2);
        }));

        it('should store the preference information', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, exampleProblem());
          scope.currentStep.choice.lower = 0.11;
          scope.currentStep.choice.upper = 0.13;
          scope.nextStep(scope.currentStep);

          expect(scope.currentStep.prefs[2].type).toEqual('ratio bound');
          expect(scope.currentStep.prefs[2].criteria).toEqual(['Prox DVT', 'Bleed']);
          expect(scope.currentStep.prefs[2].bounds.length).toEqual(2);
          expect(scope.currentStep.prefs[2].bounds[0]).toBeCloseTo(1.79);
          expect(scope.currentStep.prefs[2].bounds[1]).toBeCloseTo(2.08);

          scope.currentStep.choice.lower = 0.04;
          scope.currentStep.choice.upper = 0.05;
          expect(scope.canSave(scope.currentStep)).toBeTruthy();

          spyOn(scope.scenario, '$save');
          scope.save(scope.currentStep);
          expect(scope.scenario.$save).toHaveBeenCalled();

          var problem = exampleProblem();
          problem.criteria['Prox DVT'].pvf.direction = 'increasing';
          scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, problem);

          scope.currentStep.choice.lower = 0.12;
          scope.currentStep.choice.upper = 0.14;
          scope.nextStep(scope.currentStep);
          expect(scope.currentStep.prefs[2].type).toEqual('ratio bound');
          expect(scope.currentStep.prefs[2].criteria).toEqual(['Prox DVT', 'Bleed']);
          expect(scope.currentStep.prefs[2].bounds.length).toEqual(2);
          expect(scope.currentStep.prefs[2].bounds[0]).toBeCloseTo(1.79);
          expect(scope.currentStep.prefs[2].bounds[1]).toBeCloseTo(2.08);
        }));

        it('should sort the worst and best values', inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
          var problem = exampleProblem();
          problem.criteria['Prox DVT'].pvf.direction = 'increasing';
          var scope = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunction, problem);
          expect(scope.currentStep.choice.lower).toEqual(problem.criteria['Prox DVT'].worst());
          expect(scope.currentStep.worst()).toEqual(problem.criteria['Prox DVT'].worst());
          expect(scope.currentStep.best()).toEqual(problem.criteria['Prox DVT'].best());
        }));
      });
    });
  });