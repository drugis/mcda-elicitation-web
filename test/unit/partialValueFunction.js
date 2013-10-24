define(['angular', 'controllers/partialValueFunction'], function(angular, PartialValueFunctionHandler) {
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
});
