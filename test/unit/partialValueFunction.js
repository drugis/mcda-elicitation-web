define(['angular', 'angular-mocks', 'mcda/controllers', 'mcda/services/taskDependencies', 'mcda/services/partialValueFunction'],
 function(angular, controllers, TaskDependencies) {
  describe("PartialValueFunctionHandler", function() {
    var scope, state;

    beforeEach(module('elicit.controllers'));
    beforeEach(module('elicit.taskDependencies'));
    beforeEach(module('elicit.pvfService'));
    beforeEach(inject(function($rootScope, $controller, TaskDependencies, PartialValueFunction){
      var task = { requires: [], resets: [] },
      scenario = {
        state: PartialValueFunction.attach({ problem: exampleProblem() }),
        update: function(state) { },
        redirectToDefaultView: function() {}
      };

      scope = $rootScope.$new();
      state = jasmine.createSpyObj('$state', ['go']);

      $controller('PartialValueFunctionController', {
        $scope : scope,
        $state : state,
        currentScenario : scenario,
        taskDefinition : TaskDependencies.extendTaskDefinition(task)
      });
    }));

    describe("Create Linear Partial Value function", function() {
      var crit1,
          crit2;

      beforeEach(inject(function(PartialValueFunction) {
        crit1 = PartialValueFunction.create({
            "type": "linear",
            "direction": "increasing",
            "range": [-0.15, 0.35]
          });
        crit2 = PartialValueFunction.create({
            "type": "linear",
            "direction": "decreasing",
            "range": [50, 100]
          });
      }));

      it("determines worst values", function() {
        expect(crit1.worst()).toEqual(-0.15);
        expect(crit2.worst()).toEqual(100);
      });

      it("determines best values", function() {
        expect(crit1.best()).toEqual(0.35);
        expect(crit2.best()).toEqual(50);
      });

      it("defines the partial value function", function() {
        expect(crit1.map(0.35)).toBeCloseTo(1.0);
        expect(crit1.map(-0.15)).toBeCloseTo(0.0);
        expect(crit1.map(0.1)).toBeCloseTo(0.5);

        expect(crit2.map(50)).toBeCloseTo(1.0);
        expect(crit2.map(100)).toBeCloseTo(0.0);
        expect(crit2.map(75)).toBeCloseTo(0.5);
      });

      it("defines the inverse of the partial value function", function() {
        expect(crit1.inv(1.0)).toBeCloseTo(0.35);
        expect(crit1.inv(0.0)).toBeCloseTo(-0.15);
        expect(crit1.inv(0.5)).toBeCloseTo(0.1);

        expect(crit2.inv(1.0)).toBeCloseTo(50);
        expect(crit2.inv(0.0)).toBeCloseTo(100);
        expect(crit2.inv(0.5)).toBeCloseTo(75);
      });
    });

    describe("Create Piecewise Partial Value function", function() {
      var crit1;
      var crit2;
      beforeEach(inject(function(PartialValueFunction) {
        crit1 = PartialValueFunction.create({
          "type": "piecewise-linear",
          "direction": "increasing",
          "range": [-0.15, 0.35],
          "cutoffs": [0.0, 0.25],
          "values": [0.1, 0.9]
        });
        crit2 = PartialValueFunction.create({
          "type": "piecewise-linear",
          "direction": "decreasing",
          "range": [50, 100],
          "cutoffs": [75, 90],
          "values": [0.8, 0.5]
        });
      }));

      it("determines worst values", function() {
        expect(crit1.worst()).toEqual(-0.15);
        expect(crit2.worst()).toEqual(100);
      });

      it("determines best values", function() {
        expect(crit1.best()).toEqual(0.35);
        expect(crit2.best()).toEqual(50);
      });

      it("defines the partial value function", function() {
        expect(crit1.map(0.35)).toBeCloseTo(1.0);
        expect(crit1.map(-0.15)).toBeCloseTo(0.0);
        expect(crit1.map(0.0)).toBeCloseTo(0.1);
        expect(crit1.map(0.25)).toBeCloseTo(0.9);
        expect(crit1.map(0.1)).toBeCloseTo(2/5*0.8+0.1);

        expect(crit2.map(50)).toBeCloseTo(1.0);
        expect(crit2.map(60)).toBeCloseTo(1-(2/5*0.2));
        expect(crit2.map(75)).toBeCloseTo(0.8);
        expect(crit2.map(90)).toBeCloseTo(0.5);
        expect(crit2.map(100)).toBeCloseTo(0.0);
      });

      it("defines the inverse of the partial value function", function() {
        expect(crit1.inv(1.0)).toBeCloseTo(0.35);
        expect(crit1.inv(0.0)).toBeCloseTo(-0.15);
        expect(crit1.inv(0.1)).toBeCloseTo(0.0);
        expect(crit1.inv(0.9)).toBeCloseTo(0.25);
        expect(crit1.inv(2/5*0.8+0.1)).toBeCloseTo(0.1);

        expect(crit2.inv(1.0)).toBeCloseTo(50);
        expect(crit2.inv(1-2/5*0.2)).toBeCloseTo(60);
        expect(crit2.inv(0.8)).toBeCloseTo(75);
        expect(crit2.inv(0.5)).toBeCloseTo(90);
        expect(crit2.inv(0.0)).toBeCloseTo(100);
      });
    });

    describe("nextState()", function() {


      it("has subType 'elicit cutoffs' when there are piecewise PVF's without cutoffs", function() {
        scope.currentStep.choice.data['Bleed'].type = 'piecewise-linear';
        scope.nextStep(scope.currentStep);
        expect(scope.currentStep.choice.subType).toBe('elicit cutoffs');
        expect(scope.currentStep.choice.criterion).toBe('Bleed');
        expect(scope.currentStep.choice.data['Bleed'].cutoffs).toEqual([]);
      });

      it("should elicit values after cutoffs", function() {

        scope.currentStep.choice.data['Bleed'].type = 'piecewise-linear';
        scope.nextStep(scope.currentStep);

        expect(scope.currentStep.choice.criterion).toBe('Bleed');
        scope.currentStep.problem.criteria['Bleed'].pvf.cutoffs = [0.08, 0.03];
        scope.nextStep(scope.currentStep);

        expect(scope.currentStep.choice.subType).toBe('elicit values');
        expect(scope.currentStep.choice.criterion).toBe('Bleed');
        expect(scope.currentStep.choice.data['Bleed'].values).toEqual([]);
      });

      it("should be able to save when done", function() {
        scope.currentStep.problem.criteria['Bleed'].pvf.type = 'piecewise-linear';
        scope.nextStep(scope.currentStep);
        scope.currentStep.problem.criteria['Bleed'].pvf.cutoffs = [0.08, 0.03];
        scope.nextStep(scope.currentStep);
        scope.currentStep.problem.criteria['Bleed'].pvf.values = [0.4, 0.8];
        expect(scope.canSave(scope.currentStep)).toBeTruthy();
      });

      it("should elicit values before transitioning to next criterion", function() {

        scope.currentStep.choice.data['Bleed'].type = 'piecewise-linear';
        scope.currentStep.choice.data['Dist DVT'].type = 'piecewise-linear';
        scope.nextStep(scope.currentStep);
        expect(scope.currentStep.choice.criterion).toBe('Bleed');
        scope.currentStep.choice.data['Bleed'].cutoffs = [0.08, 0.03];
        scope.nextStep(scope.currentStep);

        expect(scope.currentStep.choice.subType).toBe('elicit values');
        expect(scope.currentStep.choice.criterion).toBe('Bleed');
        expect(scope.canProceed(scope.currentStep)).toBeFalsy();
        scope.currentStep.choice.data['Bleed'].values = [0.4, 0.8];
        expect(scope.canProceed(scope.currentStep)).toBeTruthy();
        scope.nextStep(scope.currentStep);

        expect(scope.currentStep.choice.subType).toBe('elicit cutoffs');
        expect(scope.currentStep.choice.criterion).toBe('Dist DVT');
      });

    });

  });
});
