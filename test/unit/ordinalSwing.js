define(['angular', 'angular-mocks', 'controllers', 'services/taskDependencies', 'services/partialValueFunction'],
  function(angular, controllers, TaskDependencies) {

  describe("OrdinalSwingHandler", function() {
    var $scope1;
    var $scope2;

    beforeEach(module('elicit.controllers'));
    beforeEach(module('elicit.taskDependencies'));
    beforeEach(module('elicit.pvfService'));

    function initializeScope(problem) {
      var scope;
      inject(function($controller, $rootScope, TaskDependencies, PartialValueFunction) {
        scope = $rootScope.$new();

        var scenario = {
          state: PartialValueFunction.attach({ problem: problem }),
          update: function(state) { },
          redirectToDefaultView: function() {}
        };
        scope._scenario = scenario;

        var task = {
          requires: [],
          resets: []
        };

        $controller('OrdinalSwingController', {
          $scope: scope,
          currentScenario: scenario,
          taskDefinition: TaskDependencies.extendTaskDefinition(task)
        });
      });
      return scope;
    };
    
    beforeEach(function() {
      $scope1 = initializeScope(exampleProblem());

      var problem2 = exampleProblem();
      problem2.criteria["Bleed"].pvf.direction = "increasing";
      $scope2 = initializeScope(problem2);
    });

    describe("initialize", function() {
      it("should be described as ordinal", function() {
        expect($scope1.currentStep).toBeDefined();
        expect($scope1.currentStep.title).toEqual("Ordinal SWING weighting (1/2)");
      });

      it("should not be the final state", function() {
        expect($scope1.canSave($scope1.currentStep)).toBeFalsy();
        expect($scope1.canProceed($scope1.currentStep)).toBeFalsy();
      });

      it("should have the worst alternative as reference", function() {
        expect($scope1.currentStep.reference).toEqual({"Prox DVT" : 0.25, "Dist DVT" : 0.4, "Bleed" : 0.1});
        expect($scope2.currentStep.reference).toEqual({"Prox DVT" : 0.25, "Dist DVT" : 0.4, "Bleed" : 0.0});
      });

      it("should have a single criterion improved from worst to best in each choice", function() {
        expect($scope1.currentStep.choices).toEqual({
          "Prox DVT" : {"Prox DVT" : 0.0,  "Dist DVT" : 0.4,  "Bleed" : 0.1},
          "Dist DVT" : {"Prox DVT" : 0.25, "Dist DVT" : 0.15, "Bleed" : 0.1},
          "Bleed"    : {"Prox DVT" : 0.25, "Dist DVT" : 0.4,  "Bleed" : 0.0}
        });
      });

      it("should have an empty order", function() {
        expect($scope1.currentStep.prefs.ordinal).toEqual([]);
      });
    });

    describe("nextState", function() {
      it("should not go to next step without valid selection", function() {
        expect($scope1.canProceed($scope1.currentStep)).toEqual(false);
        $scope1.currentStep.choice = "CHF";
        expect($scope1.canProceed($scope1.currentStep)).toEqual(false);
      });

      it("should have the choice as new reference", function() {
        $scope1.currentStep.choice = "Prox DVT";
        expect($scope1.canProceed($scope1.currentStep)).toEqual(true);
        $scope1.nextStep($scope1.currentStep);
        expect($scope1.currentStep.reference).toEqual({"Prox DVT" : 0.0, "Dist DVT" : 0.4, "Bleed" : 0.1});
        expect($scope1.currentStep.choice).toBeUndefined();
        expect($scope1.currentStep.title).toEqual("Ordinal SWING weighting (2/2)");

        $scope2.currentStep.choice = "Dist DVT";
        $scope2.nextStep($scope2.currentStep);
        expect($scope2.currentStep.reference).toEqual({"Prox DVT" : 0.25, "Dist DVT" : 0.15, "Bleed" : 0.0});
      });

      it("should not contain previous choice", function() {
        $scope1.currentStep.choice = "Prox DVT";
        $scope1.nextStep($scope1.currentStep);
        expect(_.keys($scope1.currentStep.choices)).toEqual(["Dist DVT", "Bleed"]);
      });

      it("should improve previous choice on all choices", function() {
        $scope1.currentStep.choice = "Prox DVT";
        $scope1.nextStep($scope1.currentStep);
        expect($scope1.currentStep.choices).toEqual({
          "Dist DVT" : {"Prox DVT" : 0.0, "Dist DVT" : 0.15, "Bleed" : 0.1},
          "Bleed"    : {"Prox DVT" : 0.0, "Dist DVT" : 0.4,  "Bleed" : 0.0}
        });
      });

      it("should push the choice onto the order", function() {
        $scope1.currentStep.choice = "Prox DVT";
        $scope1.nextStep($scope1.currentStep);
        expect($scope1.currentStep.prefs.ordinal).toEqual(["Prox DVT"]);
      });

      it("should finish when only a single choice left", function() {
        $scope1.currentStep.choice = "Prox DVT";
        $scope1.nextStep($scope1.currentStep);
        $scope1.currentStep.choice = "Dist DVT";
        expect($scope1.canSave($scope1.currentStep)).toBeTruthy();

        spyOn($scope1._scenario, "update");
        $scope1.save($scope1.currentStep);
        expect($scope1._scenario.update).toHaveBeenCalled();
        expect($scope1._scenario.update.mostRecentCall.args[0].prefs).toEqual([
          { type: "ordinal", criteria: ["Prox DVT", "Dist DVT"] },
          { type: "ordinal", criteria: ["Dist DVT", "Bleed"] }
        ]);
      });
    });

    describe("standardize", function() {
      it("should rewrite the order to separate statements", function() {
        expect($scope1.standardize({ ordinal: ["Prox DVT", "Bleed", "Dist DVT"] })).toEqual([
          { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
          { type: "ordinal", criteria: ["Bleed", "Dist DVT"] }
        ]);
      });

      it("adds missing preference data", function() {
        expect($scope1.standardize({ ordinal: ["Prox DVT"] })).toEqual([
          { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
          { type: "ordinal", criteria: ["Prox DVT", "Dist DVT"] }
        ]);

        expect($scope1.standardize({ ordinal: ["Prox DVT", "Bleed"] })).toEqual([
          { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
          { type: "ordinal", criteria: ["Bleed", "Dist DVT"] }
        ]);
      });
    });
  });
});
