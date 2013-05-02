describe("ElicitationController", function() {
	var scope1;
	var scope2;

	beforeEach(function() {
		scope1 = {};
		var ctrl1 = ElicitationController(scope1, exampleProblem());

		scope2 = {};
		var problem = exampleProblem();
		problem.criteria["Bleed"].pvf.type = "linear-increasing";
		var ctrl2 = ElicitationController(scope2, problem);
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
			var state = { title: "Foo", order: ["A", "D"] };
			scope1.currentStep = (new ChooseMethodHandler()).initialize(state);
			scope1.currentStep.choice = "done";
			expect(scope1.nextStep()).toEqual(true);
			expect(scope1.currentStep.type).toEqual("done");
			expect(scope1.currentStep.order).toEqual(["A", "D"]);
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
			expect(scope1.currentStep.order).toEqual([]);
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
			expect(scope1.currentStep.order).toEqual(["Bleed", "Dist DVT", "Prox DVT"]);
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
			expect(scope1.currentStep.order).toEqual(["Prox DVT", "Dist DVT", "Bleed"]);
		});
	});

});
