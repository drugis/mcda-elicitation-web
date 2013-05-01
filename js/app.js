function exampleProblem() {
    return {
        criteria: {
            "Prox DVT" : {
                title: "Proximal DVT",
                pvf: {
                    range: [0.0, 0.25],
                    type: "linear-decreasing"
                }
            },
            "Dist DVT" : {
                title: "Distal DVT",
                pvf: {
                    range: [0.15, 0.4],
                    type: "linear-decreasing"
                }
            },
            "Bleed" : {
                title: "Major bleeding",
                pvf: {
                    range: [0.0, 0.1],
                    type: "linear-decreasing"
                }
            }
        }
    };
}
angular.module('elicit.example', []).factory('DecisionProblem', exampleProblem);

angular.module('elicit', ['elicit.example']);

function SmaaController($scope, DecisionProblem) {
    $scope.problem = DecisionProblem;

    angular.forEach($scope.problem.criteria, function(criterion) { 
        function create(idx1, idx2) {
            return function() { 
                if (criterion.pvf.type === "linear-increasing") {
                    return criterion.pvf.range[idx1];
                } 
                return criterion.pvf.range[idx2];
            }
        }
        criterion.worst = create(0, 1);
        criterion.best = create(1,0);
    });
    
    getReference = function() {
        var criteria = $scope.problem.criteria;

        return _.object(
            _.keys(criteria), 
            _.map(criteria, function(criterion) { return criterion.worst(); })
        );
    }
    
    var title = function(step) { 
        var base = "Ordinal SWING weighting";
        var total = (_.size($scope.problem.criteria) - 1);
        if(step > total) return base + " (DONE)";
        return base + " (" + step + "/" + total + ")";
    }
        
    $scope.currentStep = {
        title: title(1),
        type: "ordinal",
        done: false,
        order: [],
        reference: getReference(),
        choices: (function() { 
            var criteria = $scope.problem.criteria;
            var choices = _.map(_.keys(criteria), function(criterion) { 
                var reference = getReference();
                reference[criterion] = criteria[criterion].best();
                return reference;
            });
            return _.object(_.keys(criteria), choices); 
        })()
    };

    $scope.nextStep = function() {
        var criteria = $scope.problem.criteria;
        var currentStep = $scope.currentStep;
        var choice = currentStep.choice;
        if(!_.contains(_.keys(criteria), choice)) { 
            return false;
        }
        _.each(currentStep.choices, function(alternative) {
            alternative[choice] = criteria[choice].best();
        });
        
        function next(choice) { 
            delete currentStep.choices[choice];
            currentStep.reference[choice] = criteria[choice].best();
            currentStep.order.push(choice);
            currentStep.title = title(currentStep.order.length + 1);
        }
        next(choice);

        if(_.size(currentStep.choices) == 1) { 
            next(_.keys(currentStep.choices)[0]);
            currentStep.done = true;
        }
        return true;
    }
};
