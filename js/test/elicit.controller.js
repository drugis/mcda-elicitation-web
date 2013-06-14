describe("ElicitationController", function() {
  var scope1;
  var scope2;
  var app = angular.module('elicit', ['elicit.example', 'elicit.services', 'clinicico']);

  function initializeScope(problem) {
    var ctrl, scope, $httpBackend;

    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller("ElicitationController",
                          { $scope: scope,
                            DecisionProblem: { get: function(callback) { callback(problem); }},
                          });
    });
    return scope;
  }

  beforeEach(function() {
    module('elicit');
    var problem = exampleProblem();
    scope1 = initializeScope(problem);
    problem = exampleProblem();
    problem.criteria["Bleed"].pvf.type = "linear-increasing";
    scope2 = initializeScope(problem);
  });

  it("should have a problem", function() {
    expect(scope1.problem);
  });

  it("should determine worst values", function() {
    expect(scope1.problem.criteria["Prox DVT"].worst()).toEqual(0.25);
    expect(scope1.problem.criteria["Bleed"].worst()).toEqual(0.1);

    expect(scope2.problem.criteria["Bleed"].worst()).toEqual(0.0);
  });

  it("should determine best values", function() {
    expect(scope1.problem.criteria["Prox DVT"].best()).toEqual(0.0);
    expect(scope1.problem.criteria["Bleed"].best()).toEqual(0.0);

    expect(scope2.problem.criteria["Bleed"].best()).toEqual(0.1);
  });

  it("should define the partial value function", function() {
    expect(scope1.problem.criteria["Prox DVT"].pvf.map(0.0)).toBeCloseTo(1.0);
    expect(scope1.problem.criteria["Prox DVT"].pvf.map(0.25)).toBeCloseTo(0.0);
    expect(scope1.problem.criteria["Prox DVT"].pvf.map(0.2)).toBeCloseTo(0.05/0.25);

    expect(scope2.problem.criteria["Bleed"].pvf.map(0.0)).toBeCloseTo(0.0);
    expect(scope2.problem.criteria["Bleed"].pvf.map(0.1)).toBeCloseTo(1.0);
    expect(scope2.problem.criteria["Bleed"].pvf.map(0.07)).toBeCloseTo(0.7);
  });

  it("should define the inverse of the partial value function", function() {
    expect(scope1.problem.criteria["Prox DVT"].pvf.inv(1.0)).toBeCloseTo(0.0);
    expect(scope1.problem.criteria["Prox DVT"].pvf.inv(0.0)).toBeCloseTo(0.25);
    expect(scope1.problem.criteria["Prox DVT"].pvf.inv(0.8)).toBeCloseTo(0.05);

    expect(scope2.problem.criteria["Bleed"].pvf.inv(0.0)).toBeCloseTo(0.0);
    expect(scope2.problem.criteria["Bleed"].pvf.inv(1.0)).toBeCloseTo(0.1);
    expect(scope2.problem.criteria["Bleed"].pvf.inv(0.7)).toBeCloseTo(0.07);
  });

  it("should initialize the currentStep with Ordinal", function() {
    expect(scope1.currentStep).toBeDefined();
    expect(scope1.currentStep.type).toEqual("ordinal");
  });

  describe("Advance to the nextStep()", function() {
    it("should not go to next step without valid selection", function() {
      expect(scope1.nextStep()).toEqual(false);
      scope1.currentStep.choice = "CHF";
      expect(scope1.nextStep()).toEqual(false);
    });

    it("should have the choice as new reference", function() {
      scope1.currentStep.choice = "Prox DVT";
      expect(scope1.nextStep()).toEqual(true);
      expect(scope1.currentStep.choice).toBeUndefined();
    });

    it("should transition to methods choice when ordinal is done", function() {
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
      scope1.currentStep = (new ChooseMethodHandler()).initialize(state);
      scope1.currentStep.choice = "done";
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

    it("correctly handles choice objects", function() {
      scope1.currentStep.type = "ratio bound";
      scope1.currentStep.prefs.ordinal = ["Prox DVT", "Bleed", "Dist DVT"];
      // FIXME: should call RatioBoundElicitationHandler.initialize()
      scope1.currentStep.prefs["ratio bound"] = [];
      scope1.currentStep.criterionA = "Prox DVT";
      scope1.currentStep.criterionB = "Bleed";
      scope1.currentStep.range = { from: 0, to: 0.25};
      scope1.currentStep.choice = { lower: 0.1, upper: 0.2 };
      // END FIXME: should call RatioBoundElicitationHandler.initialize()
      expect(scope1.nextStep()).toEqual(true); // Step 2
      scope1.currentStep.choice.lower = 0.05;
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
      expect(scope1.getStandardizedPreferences(scope1.currentStep)).toEqual([
                                                                            { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
                                                                            { type: "ordinal", criteria: ["Bleed", "Dist DVT"] }
      ]);
    });

    it("rewrites ratio bound preferences", function() {
      scope1.currentStep.prefs = { "ratio bound" : [
        { criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] }
      ] };
      expect(scope1.getStandardizedPreferences(scope1.currentStep)).toEqual([
                                                                            { type: "ratio bound", criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] }
      ]);
    });

    it("merges standardized preferences from the handlers", function() {
      scope1.currentStep.prefs = {
        ordinal : ["Prox DVT", "Bleed", "Dist DVT"],
        "ratio bound" : [
          { criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] }
        ]
      };
      expect(scope1.getStandardizedPreferences(scope1.currentStep)).toEqual([
                                                                            { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
                                                                            { type: "ordinal", criteria: ["Bleed", "Dist DVT"] },
                                                                            { type: "ratio bound", criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] }
      ]);
    });
  });
});
