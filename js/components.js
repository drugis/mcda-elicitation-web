angular.module('elicit.components', []).
  directive('slider', function() {
  var initialize = function($scope, $element) {
    function log10(x) { return Math.log(x) / Math.log(10); }

    var from = $scope.range.from;
    var to = $scope.range.to;
	var fromIncl = !$scope.range.leftOpen;
	var toIncl = !$scope.range.rightOpen;
    var delta = to - from;
    var steps = 100;

	if (!fromIncl) {
		from += delta / steps;
		delta -= delta / steps;
		--steps;
	}
	if (!toIncl) {
		to -= delta / steps;
		delta -= delta / steps;
		--steps;
	}

    function stepToValue(step) { return from + (step / steps) * delta; }
    function valueToStep(value) { return (value - from) / delta * steps; }
    function getValue() { return valueToStep($scope.model.lower) + ";" + valueToStep($scope.model.upper); }
    jQuery($element).empty();
    jQuery($element).append('<input type="slider"></input>');
    jQuery($element).find('input').attr("value", getValue());
    jQuery($element).find('input').slider({
      from: 0,
      to: steps,
      step: 1,
      calculate: stepToValue,
      skin: "round_plastic",
      onstatechange: function(value) {
        var values = value.split(';');
        $scope.model.lower = stepToValue(values[0]);
        $scope.model.upper = stepToValue(values[1]);
        $scope.$apply();
      }
    });
  };
  return {
    restrict: 'E',
    transclude: true,
    scope: { model: '=', range: '=' },
    link: function($scope, $element) {
    },
    controller: function($scope, $element) {
      $scope.$watch('range', function() {
        if ($scope.range) {
          initialize($scope, $element);
        }
      });
    },
    template: '<div class="slider"></div>',
    replace: true
  };
}).
  directive('ordinalStep', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'elicitOrdinal.html'
  };
}).
  directive('chooseMethodStep', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: { currentStep: '=' },
    templateUrl: 'chooseMethod.html'
  };
}).
  directive('ratioBoundStep', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'elicitRatioBound.html'
  };
});
