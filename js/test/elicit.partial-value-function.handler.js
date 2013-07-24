describe("PartialValueFunctionHandler", function() {
  var handler;

  describe("Create Linear Partial Value function", function() {
    var crit1;
    var crit2;
    beforeEach(function() {
      handler = new PartialValueFunctionHandler(exampleProblem());
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
      handler = new PartialValueFunctionHandler(exampleProblem());
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
});
