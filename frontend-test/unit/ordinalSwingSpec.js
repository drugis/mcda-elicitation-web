'use strict';
define(['angular-mocks',
    'mcda/controllers',
    'mcda/services/taskDependencies',
    'mcda/preferences/partialValueFunctionService'
  ],
  function() {
    var state;

    describe("OrdinalSwingHandler", function() {
      var $scope1;
      var $scope2;

      beforeEach(module('elicit.controllers'));
      beforeEach(module('elicit.taskDependencies'));
      beforeEach(module('elicit.pvfService'));

      function initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunctionService, problem) {
        var scope;
        scope = $rootScope.$new();

        scope.scenario = jasmine.createSpyObj('scenario', ['$save']);

        var task = {
          requires: [],
          resets: []
        };

        state = jasmine.createSpyObj('$state', ['go']);
        scope.aggregateState = {
          problem: problem
        };
        $controller('OrdinalSwingController', {
          $scope: scope,
          $state: state,
          $stateParams: {},
          currentScenario: scope.scenario,
          taskDefinition: TaskDependencies.extendTaskDefinition(task),
          mcdaRootPath: 'some mcda rootPath'
        });
        return scope;
      }

      beforeEach(inject(function($controller, $rootScope, TaskDependencies, PartialValueFunctionService) {
        $scope1 = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunctionService, exampleProblem());

        var problem2 = exampleProblem();
        problem2.criteria.Bleed.pvf.direction = "increasing";
        $scope2 = initializeScope($controller, $rootScope, TaskDependencies, PartialValueFunctionService, problem2);
      }));

      describe("initialize", function() {
        it("should be described as ordinal", function() {
          expect($scope1.state).toBeDefined();
          expect($scope1.state.title).toEqual("Ordinal SWING weighting (1/2)");
        });

        it("should not be the final state", function() {
          expect($scope1.canSave($scope1.state)).toBeFalsy();
          expect($scope1.canProceed($scope1.state)).toBeFalsy();
        });

        it("should have the worst alternative as reference", function() {
          expect($scope1.state.reference).toEqual({
            "Prox DVT": 0.25,
            "Dist DVT": 0.4,
            "Bleed": 0.1
          });
          expect($scope2.state.reference).toEqual({
            "Prox DVT": 0.25,
            "Dist DVT": 0.4,
            "Bleed": 0.0
          });
        });

        it("should have a single criterion improved from worst to best in each choice", function() {
          expect($scope1.state.choices).toEqual({
            "Prox DVT": {
              "Prox DVT": 0.0,
              "Dist DVT": 0.4,
              "Bleed": 0.1
            },
            "Dist DVT": {
              "Prox DVT": 0.25,
              "Dist DVT": 0.15,
              "Bleed": 0.1
            },
            "Bleed": {
              "Prox DVT": 0.25,
              "Dist DVT": 0.4,
              "Bleed": 0.0
            }
          });
        });

        it("should have an empty order", function() {
          expect($scope1.state.prefs.ordinal).toEqual([]);
        });
      });

      describe("nextState", function() {
        it("should not go to next step without valid selection", function() {
          expect($scope1.canProceed($scope1.state)).toEqual(false);
          $scope1.state.choice = "CHF";
          expect($scope1.canProceed($scope1.state)).toEqual(false);
        });

        it("should have the choice as new reference", function() {
          $scope1.state.choice = "Prox DVT";
          expect($scope1.canProceed($scope1.state)).toEqual(true);
          $scope1.nextStep($scope1.state);
          expect($scope1.state.reference).toEqual({
            "Prox DVT": 0.0,
            "Dist DVT": 0.4,
            "Bleed": 0.1
          });
          expect($scope1.state.choice).toBeUndefined();
          expect($scope1.state.title).toEqual("Ordinal SWING weighting (2/2)");

          $scope2.state.choice = "Dist DVT";
          $scope2.nextStep($scope2.state);
          expect($scope2.state.reference).toEqual({
            "Prox DVT": 0.25,
            "Dist DVT": 0.15,
            "Bleed": 0.0
          });
        });

        it("should not contain previous choice", function() {
          $scope1.state.choice = "Prox DVT";
          $scope1.nextStep($scope1.state);
          expect(_.keys($scope1.state.choices)).toEqual(["Dist DVT", "Bleed"]);
        });

        it("should improve previous choice on all choices", function() {
          $scope1.state.choice = "Prox DVT";
          $scope1.nextStep($scope1.state);
          expect($scope1.state.choices).toEqual({
            "Dist DVT": {
              "Prox DVT": 0.0,
              "Dist DVT": 0.15,
              "Bleed": 0.1
            },
            "Bleed": {
              "Prox DVT": 0.0,
              "Dist DVT": 0.4,
              "Bleed": 0.0
            }
          });
        });

        it("should push the choice onto the order", function() {
          $scope1.state.choice = "Prox DVT";
          $scope1.nextStep($scope1.state);
          expect($scope1.state.prefs.ordinal).toEqual(["Prox DVT"]);
        });
      });

    });
  });
