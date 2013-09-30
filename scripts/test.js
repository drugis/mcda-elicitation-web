describe("ChooseMethodHandler", function() {
  var handler;

  beforeEach(function() {
    handler = new ChooseMethodHandler();
  });

  describe("initialize", function() {
    it("should augment the given state", function() {
      var state = { type: "choose method", prefs: { ordinal: ["A", "B", "C"] } };
      state = handler.initialize(state);
      expect(state).toBeDefined();
      expect(state.type).toEqual("choose method");
      expect(state.prefs.ordinal).toEqual(["A", "B", "C"]);
      expect(state.methods).toEqual({"ratio bound": "Continue with ratio bound preferences", "done": "Done eliciting preferences"});
    });
  });

  describe("nextState", function() {
    it("should check the choice", function() {
      var state = handler.initialize({});
      expect(handler.validChoice(state)).toEqual(false);
      expect(handler.nextState(state)).toBeUndefined();

      state.choice = "ninjas";
      expect(handler.validChoice(state)).toEqual(false);
      expect(handler.nextState(state)).toBeUndefined();
    });

    it("should set the new type", function() {
      var state = handler.initialize({});
      state.choice = "ratio bound";
      expect(handler.validChoice(state)).toBeDefined();
      expect(state = handler.nextState(state)).toBeDefined();
      expect(state.type).toEqual("ratio bound");
      expect(state.choice).toBeUndefined();
    });
  });
});
describe("ElicitationController", function() {
  var scope1;
  var scope2;
  var app = angular.module('elicit', ['elicit.example', 'elicit.services', 'DecisionProblem', 'clinicico']);

  function initializeScope(problem) {
    var ctrl, scope;

    inject(function(DecisionProblem, $rootScope, $controller) {
      scope = $rootScope.$new();
      var dependencies =
        { $scope: scope
        }
      DecisionProblem.populateWithData(problem);
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
describe("OrdinalElicitationHandler", function() {
  var handler1;
  var handler2;
  var state1;
  var state2;

  beforeEach(function() {
    var problem1 = exampleProblem();
    var problem2 = exampleProblem();

    // ADD PVF's to problem
    problem1 = new PartialValueFunctionHandler().initialize({ problem: problem1 });
    problem2.criteria["Bleed"].pvf.direction = "increasing";
    problem2 = new PartialValueFunctionHandler().initialize({ problem: problem2 });

    handler1 = new OrdinalElicitationHandler();
    handler2 = new OrdinalElicitationHandler();

    state1 = handler1.initialize({ problem: problem1.problem });
    state2 = handler2.initialize({ problem: problem2.problem });
  });

  describe("initialize", function() {
    it("should be described as ordinal", function() {
      expect(state1).toBeDefined();
      expect(state1.type).toEqual("ordinal");
      expect(state1.title).toEqual("Ordinal SWING weighting (1/2)");
    });

    it("should not be done", function() {
      expect(state1.type).toEqual("ordinal");
    });

    it("should have the worst alternative as reference", function() {
      expect(state1.reference).toEqual({"Prox DVT" : 0.25, "Dist DVT" : 0.4, "Bleed" : 0.1});
      expect(state2.reference).toEqual({"Prox DVT" : 0.25, "Dist DVT" : 0.4, "Bleed" : 0.0});
    });

    it("should have a single criterion improved from worst to best in each choice", function() {
      expect(state1.choices).toEqual({
        "Prox DVT" : {"Prox DVT" : 0.0,  "Dist DVT" : 0.4,  "Bleed" : 0.1},
        "Dist DVT" : {"Prox DVT" : 0.25, "Dist DVT" : 0.15, "Bleed" : 0.1},
        "Bleed"    : {"Prox DVT" : 0.25, "Dist DVT" : 0.4,  "Bleed" : 0.0}
      });
    });

    it("should have an empty order", function() {
      expect(state1.prefs.ordinal).toEqual([]);
    });
  });

  describe("nextState", function() {
    it("should not go to next step without valid selection", function() {
      expect(handler1.validChoice(state1)).toEqual(false);
      expect(handler1.nextState(state1)).toBeUndefined();
      state1.choice = "CHF";
      expect(handler1.validChoice(state1)).toEqual(false);
      expect(handler1.nextState(state1)).toBeUndefined();
    });

    it("should have the choice as new reference", function() {
      state1.choice = "Prox DVT";
      expect(handler1.validChoice(state1)).toEqual(true);
      expect(state1 = handler1.nextState(state1)).toBeDefined();
      expect(state1.reference).toEqual({"Prox DVT" : 0.0, "Dist DVT" : 0.4, "Bleed" : 0.1});
      expect(state1.choice).toBeUndefined();
      expect(state1.type).toEqual("ordinal");
      expect(state1.title).toEqual("Ordinal SWING weighting (2/2)");

      state2.choice = "Dist DVT";
      expect(state2 = handler2.nextState(state2)).toBeDefined();
      expect(state2.reference).toEqual({"Prox DVT" : 0.25, "Dist DVT" : 0.15, "Bleed" : 0.0});
      expect(state2.type).toEqual("ordinal");
    });

    it("should not contain previous choice", function() {
      state1.choice = "Prox DVT";
      expect(state1 = handler1.nextState(state1)).toBeDefined();
      expect(_.keys(state1.choices)).toEqual(["Dist DVT", "Bleed"]);
    });

    it("should improve previous choice on all choices", function() {
      state1.choice = "Prox DVT";
      expect(state1 = handler1.nextState(state1)).toBeDefined();
      expect(state1.choices).toEqual({
        "Dist DVT" : {"Prox DVT" : 0.0, "Dist DVT" : 0.15, "Bleed" : 0.1},
        "Bleed"    : {"Prox DVT" : 0.0, "Dist DVT" : 0.4,  "Bleed" : 0.0}
      });
    });

    it("should push the choice onto the order", function() {
      state1.choice = "Prox DVT";
      expect(state1 = handler1.nextState(state1)).toBeDefined();
      expect(state1.prefs.ordinal).toEqual(["Prox DVT"]);
    });

    it("should finish when only a single choice left", function() {
      state1.choice = "Prox DVT";
      expect(state1 = handler1.nextState(state1)).toBeDefined();
      state1.choice = "Dist DVT";
      expect(state1 = handler1.nextState(state1)).toBeDefined();
      //expect(state1.type).not.toEqual("ordinal");
      expect(state1.type).toEqual("choose method");
      expect(state1.prefs.ordinal).toEqual(["Prox DVT", "Dist DVT", "Bleed"]);
    });
  });

  describe("standardize", function() {
  	it("adds missing preference data", function() {
      expect(handler1.standardize(["Prox DVT"])).toEqual([
	  { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
	  { type: "ordinal", criteria: ["Prox DVT", "Dist DVT"] }]);
      expect(handler1.standardize(["Prox DVT", "Bleed"])).toEqual([
	  { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
	  { type: "ordinal", criteria: ["Bleed", "Dist DVT"] }]);
	});
    it("should rewrite the order to separate statements", function() {
      expect(handler1.standardize(["Prox DVT", "Bleed", "Dist DVT"])).toEqual([
                                                                              { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
                                                                              { type: "ordinal", criteria: ["Bleed", "Dist DVT"] }
      ]);
    });
  });
});

describe("PartialValueFunctionHandler", function() {
  var handler;

  describe("Create Linear Partial Value function", function() {
    var crit1;
    var crit2;
    beforeEach(function() {
      handler = new PartialValueFunctionHandler();
      crit1 = handler.createPartialValueFunction({
        "pvf": {
          "type": "linear",
          "direction": "increasing",
          "range": [-0.15, 0.35]
        }
      });
      crit2 = handler.createPartialValueFunction({
        "pvf": {
          "type": "linear",
          "direction": "decreasing",
          "range": [50, 100]
        }
      });
    });

    it("determines worst values", function() {
      expect(crit1.worst()).toEqual(-0.15);
      expect(crit2.worst()).toEqual(100);
    });

    it("determines best values", function() {
      expect(crit1.best()).toEqual(0.35);
      expect(crit2.best()).toEqual(50);
    });

    it("defines the partial value function", function() {
      expect(crit1.pvf.map(0.35)).toBeCloseTo(1.0);
      expect(crit1.pvf.map(-0.15)).toBeCloseTo(0.0);
      expect(crit1.pvf.map(0.1)).toBeCloseTo(0.5);

      expect(crit2.pvf.map(50)).toBeCloseTo(1.0);
      expect(crit2.pvf.map(100)).toBeCloseTo(0.0);
      expect(crit2.pvf.map(75)).toBeCloseTo(0.5);
    });

    it("defines the inverse of the partial value function", function() {
      expect(crit1.pvf.inv(1.0)).toBeCloseTo(0.35);
      expect(crit1.pvf.inv(0.0)).toBeCloseTo(-0.15);
      expect(crit1.pvf.inv(0.5)).toBeCloseTo(0.1);

      expect(crit2.pvf.inv(1.0)).toBeCloseTo(50);
      expect(crit2.pvf.inv(0.0)).toBeCloseTo(100);
      expect(crit2.pvf.inv(0.5)).toBeCloseTo(75);
    });
  });

  describe("Create Piecewise Partial Value function", function() {
    var crit1;
    var crit2;
    beforeEach(function() {
      handler = new PartialValueFunctionHandler();
      crit1 = handler.createPartialValueFunction({
        "pvf": {
          "type": "piecewise-linear",
          "direction": "increasing",
          "range": [-0.15, 0.35],
          "cutoffs": [0.0, 0.25],
          "values": [0.1, 0.9]
        }
      });
      crit2 = handler.createPartialValueFunction({
        "pvf": {
          "type": "piecewise-linear",
          "direction": "decreasing",
          "range": [50, 100],
          "cutoffs": [75, 90],
          "values": [0.8, 0.5]
        }
      });
    });

    it("determines worst values", function() {
      expect(crit1.worst()).toEqual(-0.15);
      expect(crit2.worst()).toEqual(100);
    });

    it("determines best values", function() {
      expect(crit1.best()).toEqual(0.35);
      expect(crit2.best()).toEqual(50);
    });

    it("defines the partial value function", function() {
      expect(crit1.pvf.map(0.35)).toBeCloseTo(1.0);
      expect(crit1.pvf.map(-0.15)).toBeCloseTo(0.0);
      expect(crit1.pvf.map(0.0)).toBeCloseTo(0.1);
      expect(crit1.pvf.map(0.25)).toBeCloseTo(0.9);
      expect(crit1.pvf.map(0.1)).toBeCloseTo(2/5*0.8+0.1);

      expect(crit2.pvf.map(50)).toBeCloseTo(1.0);
      expect(crit2.pvf.map(60)).toBeCloseTo(1-(2/5*0.2));
      expect(crit2.pvf.map(75)).toBeCloseTo(0.8);
      expect(crit2.pvf.map(90)).toBeCloseTo(0.5);
      expect(crit2.pvf.map(100)).toBeCloseTo(0.0);
    });

    it("defines the inverse of the partial value function", function() {
      expect(crit1.pvf.inv(1.0)).toBeCloseTo(0.35);
      expect(crit1.pvf.inv(0.0)).toBeCloseTo(-0.15);
      expect(crit1.pvf.inv(0.1)).toBeCloseTo(0.0);
      expect(crit1.pvf.inv(0.9)).toBeCloseTo(0.25);
      expect(crit1.pvf.inv(2/5*0.8+0.1)).toBeCloseTo(0.1);

      expect(crit2.pvf.inv(1.0)).toBeCloseTo(50);
      expect(crit2.pvf.inv(1-2/5*0.2)).toBeCloseTo(60);
      expect(crit2.pvf.inv(0.8)).toBeCloseTo(75);
      expect(crit2.pvf.inv(0.5)).toBeCloseTo(90);
      expect(crit2.pvf.inv(0.0)).toBeCloseTo(100);
      });
  });

  describe("nextState()", function() {
    var handler;
    beforeEach(function() {
      handler = new PartialValueFunctionHandler();
    });

    it("transitions to ordinal if there are no piecewise PVF's", function() {
      var problem = exampleProblem();
      var state = handler.initialize({ problem: problem });
      state = handler.nextState(state);
      expect(state.type).toBe('ordinal');
    });

    it("has subType 'elicit cutoffs' when there are piecewise PVF's without cutoffs", function() {
      var problem = exampleProblem();
      var state = handler.initialize({ problem: problem });
      state.choice.data['Bleed'].type = 'piecewise-linear';
      state = handler.nextState(state);
      expect(state.type).toBe('partial value function');
      expect(state.choice.subType).toBe('elicit cutoffs');
      expect(state.choice.criterion).toBe('Bleed');
      expect(state.choice.data['Bleed'].cutoffs).toEqual([]);
    });

    it("should elicit values after cutoffs", function() {
      var problem = exampleProblem();
      var state = handler.initialize({ problem: problem });
      state.choice.data['Bleed'].type = 'piecewise-linear';
      state = handler.nextState(state);
      expect(state.choice.criterion).toBe('Bleed');
      state.problem.criteria['Bleed'].pvf.cutoffs = [0.08, 0.03];
      state = handler.nextState(state);

      expect(state.type).toBe('partial value function');
      expect(state.choice.subType).toBe('elicit values');
      expect(state.choice.criterion).toBe('Bleed');
      expect(state.choice.data['Bleed'].values).toEqual([]);
    });

    it("should transition to ordinal when done", function() {
      var problem = exampleProblem();
      var state = handler.initialize({ problem: problem });
      state.problem.criteria['Bleed'].pvf.type = 'piecewise-linear';
      state = handler.nextState(state);
      state.problem.criteria['Bleed'].pvf.cutoffs = [0.08, 0.03];
      state = handler.nextState(state);
      state.problem.criteria['Bleed'].pvf.values = [0.4, 0.8];
      state = handler.nextState(state);

      expect(state.type).toBe('ordinal');
    });

    it("should elicit values before transitioning to next criterion", function() {
      var problem = exampleProblem();
      var state = handler.initialize({ problem: problem });
      state.choice.data['Bleed'].type = 'piecewise-linear';
      state.choice.data['Dist DVT'].type = 'piecewise-linear';
      state = handler.nextState(state);
      expect(state.choice.criterion).toBe('Bleed');
      state.choice.data['Bleed'].cutoffs = [0.08, 0.03];
      state = handler.nextState(state);

      expect(state.type).toBe('partial value function');
      expect(state.choice.subType).toBe('elicit values');
      expect(state.choice.criterion).toBe('Bleed');
    });

  });

});
describe("RatioBoundElicitationHandler", function() {
  var handler;
  var state;
  var problem;
  var app = angular.module('elicit', ['elicit.example', 'elicit.services', 'clinicico']);

  function initProblem(problem) {
     return (new PartialValueFunctionHandler().initialize({problem: problem})).problem;
  }

  beforeEach(function() {
    problem = exampleProblem();

    problem = (new PartialValueFunctionHandler(problem).initialize({ problem: problem })).problem;
    initial = _.extend({ problem: problem, prefs: { ordinal: ["Prox DVT", "Bleed", "Dist DVT"] } });
    handler = new RatioBoundElicitationHandler();
    state = handler.initialize(initial);
  });


  describe("initialize", function() {
    it("should start comparing the first two criteria", function() {
      expect(state.criterionA).toEqual("Prox DVT");
      expect(state.criterionB).toEqual("Bleed");
      expect(state.choice.lower).toEqual(problem.criteria["Prox DVT"].best());
      expect(state.choice.upper).toEqual(problem.criteria["Prox DVT"].worst());
      expect(state.worst()).toEqual(problem.criteria["Prox DVT"].worst());
      expect(state.best()).toEqual(problem.criteria["Prox DVT"].best());
    });

    it("should sort the worst and best values", function() {
      problem.criteria["Prox DVT"].pvf.direction = "increasing";
      problem = initProblem(problem);
      handler = new RatioBoundElicitationHandler();
      state = handler.initialize({ problem: problem, prefs: { ordinal: ["Prox DVT", "Bleed", "Dist DVT"] } });

      expect(state.choice.lower).toEqual(problem.criteria["Prox DVT"].worst());
      expect(state.worst()).toEqual(problem.criteria["Prox DVT"].worst());
      expect(state.best()).toEqual(problem.criteria["Prox DVT"].best());
    });

    it("should make best() and worst() functions of choice", function() {
      state.choice = { lower: 0.1, upper: 0.2 };
      expect(state.worst()).toEqual(0.2);
      expect(state.best()).toEqual(0.1);
    });

    it("should set the title", function() {
      expect(state.title).toEqual("Ratio Bound SWING weighting (1/2)");
    });
  });

  describe("validChoice", function() {
    it("should check that lower < upper", function() {
      state.choice.lower = 0.2;
      state.choice.upper = 0.1;
      expect(handler.validChoice(state)).toEqual(false);
      state.choice.upper = 0.2;
      expect(handler.validChoice(state)).toEqual(false);
      state.choice.upper = 0.21;
      expect(handler.validChoice(state)).toEqual(true);
    });

    it("should check that the choice is contained in the scale range", function() {
      state.choice.lower = -0.05;
      state.choice.upper = 0.26;
      expect(handler.validChoice(state)).toEqual(false);
      state.choice.upper = 0.25;
      expect(handler.validChoice(state)).toEqual(false);
      state.choice.lower = 0.0;
      expect(handler.validChoice(state)).toEqual(true);
      state.choice.upper = 0.26;
      expect(handler.validChoice(state)).toEqual(false);
    });
  });

  describe("nextState", function() {
    it("should transition to the next two criteria", function() {
      state = handler.nextState(state);
      expect(state.criterionA).toEqual("Bleed");
      expect(state.criterionB).toEqual("Dist DVT");
      expect(state.choice.lower).toEqual(problem.criteria["Bleed"].best());
      expect(state.choice.upper).toEqual(problem.criteria["Bleed"].worst());
    });

    it("should transition to done when criteria run out", function() {
      state = handler.nextState(state);
      state = handler.nextState(state);
      expect(state.type).toEqual("done");
    });

    it("should set the title", function() {
      state = handler.nextState(state);
      expect(state.title).toEqual("Ratio Bound SWING weighting (2/2)");
      state = handler.nextState(state);
      expect(state.title).toEqual("Ratio Bound SWING weighting (DONE)");
    });

    it("should store the preference information", function() {
      state.choice.lower = 0.11;
      state.choice.upper = 0.13;
      state = handler.nextState(state);
      expect(state.prefs['ratio bound'][0].criteria).toEqual(["Prox DVT", "Bleed"]);
      expect(state.prefs['ratio bound'][0].bounds.length).toEqual(2);
      expect(state.prefs['ratio bound'][0].bounds[0]).toBeCloseTo(1.79);
      expect(state.prefs['ratio bound'][0].bounds[1]).toBeCloseTo(2.08);

      state.choice.lower = 0.04;
      state.choice.upper = 0.05;
      state = handler.nextState(state);
      expect(state.prefs['ratio bound'][1].criteria).toEqual(["Bleed", "Dist DVT"]);
      expect(state.prefs['ratio bound'][1].bounds.length).toEqual(2);
      expect(state.prefs['ratio bound'][1].bounds[0]).toBeCloseTo(1.67);
      expect(state.prefs['ratio bound'][1].bounds[1]).toBeCloseTo(2.00);

      problem.criteria["Prox DVT"].pvf.direction = "increasing";
      problem.criteria["Prox DVT"] = new PartialValueFunctionHandler().createPartialValueFunction(problem.criteria["Prox DVT"]);

      handler = new RatioBoundElicitationHandler();
      state = handler.initialize({ problem: problem, prefs: { ordinal: ["Prox DVT", "Bleed", "Dist DVT"] } });

      state.choice.lower = 0.12;
      state.choice.upper = 0.14;
      state = handler.nextState(state);
      expect(state.prefs['ratio bound'][0].criteria).toEqual(["Prox DVT", "Bleed"]);
      expect(state.prefs['ratio bound'][0].bounds.length).toEqual(2);
      expect(state.prefs['ratio bound'][0].bounds[0]).toBeCloseTo(1.79);
      expect(state.prefs['ratio bound'][0].bounds[1]).toBeCloseTo(2.08);
    });

    it("should sort the worst and best values", function() {
      problem.criteria["Prox DVT"].pvf.direction = "increasing";
      problem = initProblem(problem);
      handler = new RatioBoundElicitationHandler(problem);
      state = handler.initialize({ problem: problem, prefs: { ordinal: ["Prox DVT", "Bleed", "Dist DVT"] } });

      expect(state.choice.lower).toEqual(problem.criteria["Prox DVT"].worst());
      expect(state.worst()).toEqual(problem.criteria["Prox DVT"].worst());
      expect(state.best()).toEqual(problem.criteria["Prox DVT"].best());
    });
  });

  describe("standardize", function() {
    it("should insert the statement type", function() {
      expect(handler.standardize([
                                 { criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] },
                                 { criteria: ["Bleed", "Bronchitis"], bounds: [5.3, 8.9] }
      ])).toEqual([
      { type: "ratio bound", criteria: ["Prox DVT", "Bleed"], bounds: [1.03, 1.52] },
      { type: "ratio bound", criteria: ["Bleed", "Bronchitis"], bounds: [5.3, 8.9] }
      ]);
    });
  });
});

