function RatioBoundElicitationHandler(problem) {
	function getBounds(criterionName) { 
		var criterion = problem.criteria[criterionName];
		return [criterion.worst(), criterion.best()].sort();
	}
		
	var title = function(step) { 
        var base = "Ratio Bound SWING weighting";
        var total = (_.size(problem.criteria) - 1);
        if(step > total) return base + " (DONE)";
        return base + " (" + step + "/" + total + ")";
    }
	
	function buildInitial(criterionA, criterionB, step) { 
		var bounds = getBounds(criterionA);
		var increasing = problem.criteria[criterionA].pvf.type === 'linear-increasing';
		return { title: title(step),
				 criterionA: criterionA,
				 criterionB: criterionB,
				 best: function() { return increasing ? this.choice.upper : this.choice.lower },
				 worst: function() { return increasing ? this.choice.lower : this.choice.upper },
				 choice: { lower: bounds[0],
						   upper: bounds[1]
						 }
				}
	}

	this.initialize = function(state) {
		return _.extend(state, buildInitial(state.order[0], state.order[1], 1));
	}

	this.validChoice = function(currentState) {
		var bounds1 = currentState.choice;
		var bounds2 = getBounds(currentState.criterionA);
		return bounds1.lower < bounds1.upper && bounds2[0] <= bounds1.lower && bounds2[1] >= bounds1.upper;
	}

	this.nextState = function(currentState) {
		if(!this.validChoice(currentState)) return;
		var order = currentState.order;

		var idx = _.indexOf(order, currentState.criterionB);
		if(idx > order.length - 2) {
			return _.extend(currentState, {type: "done", title: title(idx + 1)});
		}
		return _.extend(currentState, buildInitial(order[idx], order[idx + 1], idx + 1));
	}

	return this;
}
