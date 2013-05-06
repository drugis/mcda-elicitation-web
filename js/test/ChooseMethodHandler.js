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
