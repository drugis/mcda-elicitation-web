describe("OrdinalElicitationHandler", function() {
  var handler1;
  var handler2;
  var state1;
  var state2;
  var app = angular.module('app', ['elicit.example', 'elicit.services']);
  var problem;

  function initializeScope() {
    var ctrl, scope, $httpBackend;

    inject(function($injector, $rootScope, $controller) {

      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenGET('thrombolytics.json').respond(problem);

      scope = $rootScope.$new();
      ctrl = $controller("ElicitationController",
                          { $scope: scope,
                            DecisionProblem: $injector.get("DecisionProblem"),
                            Jobs: null});
      $httpBackend.flush();
    });
    return scope;
  }

  beforeEach(function() {
    module('app');
    problem = exampleProblem();
    scope1 = initializeScope();
    problem.criteria["Bleed"].pvf.type = "linear-increasing";
    scope2 = initializeScope();

    handler1 = new OrdinalElicitationHandler(scope1.problem);
    handler2 = new OrdinalElicitationHandler(scope2.problem);

    state1 = handler1.initialize({});
    state2 = handler2.initialize({});
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
    it("should rewrite the order to separate statements", function() {
      expect(handler1.standardize(["Prox DVT", "Bleed"])).toEqual([{ type: "ordinal", criteria: ["Prox DVT", "Bleed"] }]);
      expect(handler1.standardize(["Prox DVT", "Bleed", "Dist DVT"])).toEqual([
                                                                              { type: "ordinal", criteria: ["Prox DVT", "Bleed"] },
                                                                              { type: "ordinal", criteria: ["Bleed", "Dist DVT"] }
      ]);
    });
  });
});

