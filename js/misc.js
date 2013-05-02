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
