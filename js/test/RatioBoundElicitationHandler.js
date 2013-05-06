describe("RatioBoundElicitationHandler", function() {
  var scope;
  var handler;
  var state;

  beforeEach(function() {
    scope = {};
    ElicitationController(scope, exampleProblem());
    handler = new RatioBoundElicitationHandler(scope.problem);
    state = handler.initialize({ prefs: { ordinal: ["Prox DVT", "Bleed", "Dist DVT"] } });
  });

  describe("initialize", function() {
    it("should start comparing the first two criteria", function() {
      expect(state.criterionA).toEqual("Prox DVT");
      expect(state.criterionB).toEqual("Bleed");
      expect(state.choice.lower).toEqual(scope.problem.criteria["Prox DVT"].best());
      expect(state.choice.upper).toEqual(scope.problem.criteria["Prox DVT"].worst());
      expect(state.worst()).toEqual(scope.problem.criteria["Prox DVT"].worst());
      expect(state.best()).toEqual(scope.problem.criteria["Prox DVT"].best());
    });

    it("should sort the worst and best values", function() {
      problem = exampleProblem();
      problem.criteria["Prox DVT"].pvf.type = "linear-increasing";
      scope = {};
      ElicitationController(scope, problem);
      handler = new RatioBoundElicitationHandler(scope.problem);
      state = handler.initialize({ prefs: { ordinal: ["Prox DVT", "Bleed", "Dist DVT"] } });

      expect(state.choice.lower).toEqual(scope.problem.criteria["Prox DVT"].worst());
      expect(state.worst()).toEqual(scope.problem.criteria["Prox DVT"].worst());
      expect(state.best()).toEqual(scope.problem.criteria["Prox DVT"].best());
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
      expect(state.choice.lower).toEqual(scope.problem.criteria["Bleed"].best());
      expect(state.choice.upper).toEqual(scope.problem.criteria["Bleed"].worst());
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

      problem = exampleProblem();
      problem.criteria["Prox DVT"].pvf.type = "linear-increasing";
      scope = {};
      ElicitationController(scope, problem);
      handler = new RatioBoundElicitationHandler(scope.problem);
      state = handler.initialize({ prefs: { ordinal: ["Prox DVT", "Bleed", "Dist DVT"] } });

      state.choice.lower = 0.12;
      state.choice.upper = 0.14;
      state = handler.nextState(state);
      expect(state.prefs['ratio bound'][0].criteria).toEqual(["Prox DVT", "Bleed"]);
      expect(state.prefs['ratio bound'][0].bounds.length).toEqual(2);
      expect(state.prefs['ratio bound'][0].bounds[0]).toBeCloseTo(1.79);
      expect(state.prefs['ratio bound'][0].bounds[1]).toBeCloseTo(2.08);
    });

    it("should sort the worst and best values", function() {
      problem = exampleProblem();
      problem.criteria["Prox DVT"].pvf.type = "linear-increasing";
      scope = {};
      ElicitationController(scope, problem);
      handler = new RatioBoundElicitationHandler(scope.problem);
      state = handler.initialize({ prefs: { ordinal: ["Prox DVT", "Bleed", "Dist DVT"] } });

      expect(state.choice.lower).toEqual(scope.problem.criteria["Prox DVT"].worst());
      expect(state.worst()).toEqual(scope.problem.criteria["Prox DVT"].worst());
      expect(state.best()).toEqual(scope.problem.criteria["Prox DVT"].best());
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

