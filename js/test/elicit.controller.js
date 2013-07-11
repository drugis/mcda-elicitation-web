describe("ElicitationController", function() {
  var scope1;
  var scope2;
  var app = angular.module('elicit', ['elicit.example', 'elicit.services', 'clinicico']);

  function initializeScope(problem) {
    var ctrl, scope;

    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      var dependencies =
        { $scope: scope,
          DecisionProblem: { get: function(callback) { callback(problem); }} }
      ctrl = $controller("ElicitationController", dependencies);
    });
    return scope;
  }

  function skipToOrdinal(scope) {
    scope.nextStep(); // Scale range -> Partial Value Function
    scope.nextStep(); // Partial Value Function -> Ordinal
  }

  beforeEach(function() {
    module('elicit');
    scope1 = initializeScope(exampleProblem());
    var problem = exampleProblem();
    problem.criteria["Bleed"].pvf.direction = "increasing";
    scope2 = initializeScope(problem);
  });

  it("should initialize the currentStep with scale range", function() {
    expect(scope1.currentStep).toBeDefined();
    expect(scope1.currentStep.type).toEqual("scale range");
  });

  describe("Advance to the nextStep()", function() {
    it("should not go to next step without valid selection", function() {
      skipToOrdinal(scope1);
      expect(scope1.nextStep()).toEqual(false);
      scope1.currentStep.choice = "CHF";
      expect(scope1.nextStep()).toEqual(false);
    });

    it("should have the choice as new reference", function() {
      skipToOrdinal(scope1);
      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toEqual(true);
      expect(scope1.currentStep.choice).toBeUndefined();
    });

    it("should transition to methods choice when ordinal is done", function() {
      skipToOrdinal(scope1);
      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toEqual(true);
      scope1.currentStep.choice = "Dist DVT";
      expect(scope1.nextStep()).toEqual(true);
      expect(scope1.currentStep.type).toEqual("choose method");
      expect(scope1.currentStep.choice).toBeUndefined();
      expect(scope1.currentStep.methods).toBeDefined();
    });

    it("should cleanly transition to done", function() {
      var state = { title: "Foo", prefs: { ordinal: ["A", "D"] } };
      scope1.currentStep = (new ChooseMethodHandler()).initialize(_.extend(state, {problem: exampleProblem() }));
      scope1.currentStep.choice = "done";
      scope1.currentStep.results = {ranks: {}, cw: {}};
      expect(scope1.nextStep()).toEqual(true);
      expect(scope1.currentStep.type).toEqual("done");
      expect(scope1.currentStep.prefs.ordinal).toEqual(["A", "D"]);
      expect(scope1.currentStep.title).toEqual("Done eliciting preferences");
      expect(state.title).toEqual("Foo");
    });
  });

  describe("Go back to the previousStep()", function() {
    it("should not go back if on the first step", function() {
      expect(scope1.previousStep()).toEqual(false);
    });

    it("should reset to the previous state", function() {
      skipToOrdinal(scope1);

      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toEqual(true);
      expect(scope1.previousStep()).toEqual(true);
      expect(scope1.currentStep.prefs.ordinal).toEqual([]);
      expect(scope1.currentStep.reference).toEqual({"Prox DVT" : 0.25, "Dist DVT" : 0.4, "Bleed" : 0.1});
      expect(_.keys(scope1.currentStep.choices)).toEqual(["Prox DVT", "Dist DVT", "Bleed"]);
      expect(scope1.currentStep.title).toEqual("Ordinal SWING weighting (1/2)");
      expect(scope1.currentStep.choice).toEqual("Prox DVT");
    });

    it("should remember the next state", function() {
      skipToOrdinal(scope1);

      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toEqual(true);
      scope1.currentStep.choice = "Bleed";
      expect(scope1.nextStep()).toEqual(true); // Done

      expect(scope1.previousStep()).toEqual(true);
      expect(scope1.currentStep.choice).toEqual("Bleed");

      expect(scope1.previousStep()).toEqual(true);
      expect(scope1.currentStep.choice).toEqual("Prox DVT");
      expect(scope1.nextStep()).toEqual(true);
      expect(scope1.currentStep.choice).toEqual("Bleed");
      expect(scope1.nextStep()).toEqual(true);
    });

    it("should reset the next state on a different choice", function() {
      skipToOrdinal(scope1);

      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toEqual(true);
      scope1.currentStep.choice = "Bleed";
      expect(scope1.nextStep()).toEqual(true); // Done

      expect(scope1.previousStep()).toEqual(true); // Step 2
      expect(scope1.currentStep.choice).toEqual("Bleed");

      expect(scope1.previousStep()).toEqual(true); // Step 1
      expect(scope1.currentStep.choice).toEqual("Prox DVT");
      scope1.currentStep.choice = "Bleed";
      expect(scope1.nextStep()).toEqual(true); // Step 2
      expect(scope1.currentStep.choice).toBeUndefined();

      scope1.currentStep.choice = "Dist DVT";
      expect(scope1.nextStep()).toEqual(true); // Done
      expect(scope1.currentStep.choice).toBeUndefined();
      expect(scope1.currentStep.prefs.ordinal).toEqual(["Bleed", "Dist DVT", "Prox DVT"]);
    });

    it("should correctly reset the last state on a different choice", function() {
      skipToOrdinal(scope1);
      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toEqual(true);
      scope1.currentStep.choice = "Bleed";
      expect(scope1.nextStep()).toEqual(true); // Done

      expect(scope1.previousStep()).toEqual(true); // Step 2
      expect(scope1.currentStep.choice).toEqual("Bleed");
      scope1.currentStep.choice = "Dist DVT";
      expect(scope1.nextStep()).toEqual(true); // Done

      expect(scope1.currentStep.choice).toBeUndefined();
      expect(scope1.currentStep.prefs.ordinal).toEqual(["Prox DVT", "Dist DVT", "Bleed"]);
    });
    it("correctly carries over state", function() {
      expect(scope1.currentStep.type).toBe("scale range");
      expect(scope1.currentStep.problem).toBeDefined();
      expect(scope1.nextStep()).toBeTruthy();
      expect(scope1.currentStep.problem).toBeDefined();
      expect(scope1.currentStep.type).toBe("partial value function");
      expect(scope1.nextStep()).toBeTruthy();
      expect(scope1.currentStep.problem).toBeDefined();
      expect(scope1.currentStep.type).toBe("ordinal");

      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toBeTruthy();
      expect(scope1.currentStep.problem).toBeDefined();
      scope1.currentStep.choice = "Dist DVT";
      expect(scope1.nextStep()).toBeTruthy();
      expect(scope1.currentStep.problem).toBeDefined();
      expect(scope1.currentStep.type).toEqual("choose method");
      scope1.currentStep.choice = "ratio bound";
      expect(scope1.currentStep.problem).toBeDefined();
      expect(scope1.nextStep()).toBeTruthy();
      expect(scope1.currentStep.type).toEqual("ratio bound");
      expect(scope1.currentStep.problem).toBeDefined();
    });
    it("correctly handles choice objects", function() {
      skipToOrdinal(scope1);
      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toBeTruthy();
      scope1.currentStep.choice = "Bleed";
      expect(scope1.nextStep()).toBeTruthy();
      expect(scope1.currentStep.type).toEqual("choose method");
      scope1.currentStep.choice = "ratio bound";
      expect(scope1.nextStep()).toBeTruthy();
      expect(scope1.currentStep.type).toEqual("ratio bound");
      scope1.currentStep.prefs.ordinal = ["Prox DVT", "Bleed", "Dist DVT"];

      scope1.currentStep.prefs["ratio bound"] = [];
      scope1.currentStep.criterionA = "Prox DVT";
      scope1.currentStep.criterionB = "Bleed";
      scope1.currentStep.range = { from: 0, to: 0.25 };
      scope1.currentStep.choice = { lower: 0.1, upper: 0.2 };

      expect(scope1.nextStep()).toEqual(true); // Step 2
      scope1.currentStep.choice.lower = 0.05;
      scope1.currentStep.results = {ranks: {}, cw: {}};
      expect(scope1.nextStep()).toEqual(true); // Done

      expect(scope1.previousStep()).toEqual(true); // Step 2
      expect(scope1.currentStep.choice).toEqual({ lower: 0.05, upper: 0.1 });

      expect(scope1.previousStep()).toEqual(true); // Step 1
      expect(scope1.currentStep.choice).toEqual({ lower: 0.1, upper: 0.2 });
      expect(scope1.nextStep()).toEqual(true); // Step 2
      expect(scope1.currentStep.choice).toEqual({ lower: 0.05, upper: 0.1 });
    });
  });

  describe("getStandardizedPreferences", function() {
    it("rewrites ordinal preferences", function() {
      scope1.currentStep.prefs = { ordinal : ["Prox DVT", "Bleed", "Dist DVT"] };
      var expected = [
        { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
        { type: "ordinal", criteria: ["Bleed", "Dist DVT"] }
      ]
      expect(scope1.getStandardizedPreferences(scope1.currentStep)).toEqual(expected);
    });

    it("rewrites ratio bound preferences", function() {
      scope1.currentStep.prefs = { "ratio bound" : [
        { criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] }
      ] };
      var expected = [
        { type: "ratio bound", criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] }
      ]
      expect(scope1.getStandardizedPreferences(scope1.currentStep)).toEqual(expected);
    });

    it("merges standardized preferences from the handlers", function() {
      scope1.currentStep.prefs = {
        ordinal : ["Prox DVT", "Bleed", "Dist DVT"],
        "ratio bound" : [ { criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] } ]
      };
      var expected = [
        { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
        { type: "ordinal", criteria: ["Bleed", "Dist DVT"] },
        { type: "ratio bound", criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] }
      ]
      expect(scope1.getStandardizedPreferences(scope1.currentStep)).toEqual(expected);
    });
  });
});
