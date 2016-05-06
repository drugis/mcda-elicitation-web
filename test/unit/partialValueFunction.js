define(['angular',
    'angular-mocks',
    'mcda/services/taskDependencies',
    'mcda/services/pataviService',
    'mcda/services/util',
    'mcda/services/effectsTableService'
  ],
  function(angular, controllers, TaskDependencies) {
    describe("PartialValueFunctionHandler", function() {
      var scope, state;

      beforeEach(module('elicit.effectsTableService'));
      beforeEach(module('elicit.controllers'));
      beforeEach(module('elicit.taskDependencies'));
      beforeEach(module('elicit.pvfService'));
      beforeEach(module('elicit.pataviService'));


      beforeEach(inject(function($rootScope, $controller, TaskDependencies) {
        var task = {
            requires: [],
            resets: []
          },
          scenario = {
            state: {
              problem: exampleProblem()
            },
            update: function(state) {},
            redirectToDefaultView: function() {}
          };

        scope = $rootScope.$new();
        state = jasmine.createSpyObj('$state', ['go']);

        scope.scenario = scenario;

        $controller('PartialValueFunctionController', {
          $scope: scope,
          $state: state,
          $stateParams: {},
          currentScenario: scenario,
          taskDefinition: TaskDependencies.extendTaskDefinition(task)
        });
      }));

      describe("Create Linear Partial Value function", function() {

        var crit1 = {
          pvf: {
          "type": "linear",
          "direction": "increasing",
          "range": [-0.15, 0.35]
        }};

        var crit2 = {
          pvf: {
          "type": "linear",
          "direction": "decreasing",
          "range": [50, 100]
        }};


        it("determines worst values", inject(function(PartialValueFunction) {
          expect(PartialValueFunction.worst(crit1)).toEqual(-0.15);
          expect(PartialValueFunction.worst(crit2)).toEqual(100);
        }));

        it("determines best values", inject(function(PartialValueFunction) {
          expect(PartialValueFunction.best(crit1)).toEqual(0.35);
          expect(PartialValueFunction.best(crit2)).toEqual(50);
        }));

        it("defines the partial value function", inject(function(PartialValueFunction) {
          expect(PartialValueFunction.map(crit1)(0.35)).toBeCloseTo(1.0);
          expect(PartialValueFunction.map(crit1)(-0.15)).toBeCloseTo(0.0);
          expect(PartialValueFunction.map(crit1)(0.1)).toBeCloseTo(0.5);

          expect(PartialValueFunction.map(crit2)(50)).toBeCloseTo(1.0);
          expect(PartialValueFunction.map(crit2)(100)).toBeCloseTo(0.0);
          expect(PartialValueFunction.map(crit2)(75)).toBeCloseTo(0.5);
        }));

        it("defines the inverse of the partial value function", inject(function(PartialValueFunction) {
          expect(PartialValueFunction.inv(crit1)(1.0)).toBeCloseTo(0.35);
          expect(PartialValueFunction.inv(crit1)(0.0)).toBeCloseTo(-0.15);
          expect(PartialValueFunction.inv(crit1)(0.5)).toBeCloseTo(0.1);

          expect(PartialValueFunction.inv(crit2)(1.0)).toBeCloseTo(50);
          expect(PartialValueFunction.inv(crit2)(0.0)).toBeCloseTo(100);
          expect(PartialValueFunction.inv(crit2)(0.5)).toBeCloseTo(75);
        }));
      });

      describe("Create Piecewise Partial Value function", function() {
        var crit1, crit2;

        crit1 =  {
          pvf: {
            "type": "piecewise-linear",
            "direction": "increasing",
            "range": [-0.15, 0.35],
            "cutoffs": [0.0, 0.25],
            "values": [0.1, 0.9]
          }
        };
        crit2 = {
          pvf: {
          "type": "piecewise-linear",
          "direction": "decreasing",
          "range": [50, 100],
          "cutoffs": [75, 90],
          "values": [0.8, 0.5]
          }
        };

        it("determines worst values", inject(function(PartialValueFunction) {
          expect(PartialValueFunction.worst(crit1)).toEqual(-0.15);
          expect(PartialValueFunction.worst(crit2)).toEqual(100);
        }));

        it("determines best values", inject(function(PartialValueFunction) {
          expect(PartialValueFunction.best(crit1)).toEqual(0.35);
          expect(PartialValueFunction.best(crit2)).toEqual(50);
        }));

        it("defines the partial value function", inject(function(PartialValueFunction) {
          expect(PartialValueFunction.map(crit1)(0.35)).toBeCloseTo(1.0);
          expect(PartialValueFunction.map(crit1)(-0.15)).toBeCloseTo(0.0);
          expect(PartialValueFunction.map(crit1)(0.0)).toBeCloseTo(0.1);
          expect(PartialValueFunction.map(crit1)(0.25)).toBeCloseTo(0.9);
          expect(PartialValueFunction.map(crit1)(0.1)).toBeCloseTo(2 / 5 * 0.8 + 0.1);

          expect(PartialValueFunction.map(crit2)(50)).toBeCloseTo(1.0);
          expect(PartialValueFunction.map(crit2)(60)).toBeCloseTo(1 - (2 / 5 * 0.2));
          expect(PartialValueFunction.map(crit2)(75)).toBeCloseTo(0.8);
          expect(PartialValueFunction.map(crit2)(90)).toBeCloseTo(0.5);
          expect(PartialValueFunction.map(crit2)(100)).toBeCloseTo(0.0);
        }));

        it("defines the inverse of the partial value function", inject(function(PartialValueFunction) {
          expect(PartialValueFunction.inv(crit1)(1.0)).toBeCloseTo(0.35);
          expect(PartialValueFunction.inv(crit1)(0.0)).toBeCloseTo(-0.15);
          expect(PartialValueFunction.inv(crit1)(0.1)).toBeCloseTo(0.0);
          expect(PartialValueFunction.inv(crit1)(0.9)).toBeCloseTo(0.25);
          expect(PartialValueFunction.inv(crit1)(2 / 5 * 0.8 + 0.1)).toBeCloseTo(0.1);

          expect(PartialValueFunction.inv(crit2)(1.0)).toBeCloseTo(50);
          expect(PartialValueFunction.inv(crit2)(1 - 2 / 5 * 0.2)).toBeCloseTo(60);
          expect(PartialValueFunction.inv(crit2)(0.8)).toBeCloseTo(75);
          expect(PartialValueFunction.inv(crit2)(0.5)).toBeCloseTo(90);
          expect(PartialValueFunction.inv(crit2)(0.0)).toBeCloseTo(100);
        }));
      });

      describe("Piecwise Partial Value Functions map", function() {

        var crit =  {
          pvf: {
            "type": "piecewise-linear",
            "direction": "increasing",
            "range": [4, 8],
            "cutoffs": [4.5, 5, 6.5],
            "values": [0.25, 0.5, 0.75]
          }
        };

        it("works for three cutoffs", inject(function(PartialValueFunction) {
          var map = PartialValueFunction.map(crit);
          expect(map(5)).toBeCloseTo(0.5);
        }));
      });
    });
  });
