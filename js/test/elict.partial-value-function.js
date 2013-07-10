describe("PartialValueFunctionHandler", function() {
  var handler;

  describe("Create Partial Value function", function() {
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
});
