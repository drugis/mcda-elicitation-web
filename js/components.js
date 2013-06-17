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

    var precision = 3;
    function stepToValue(step) { return (from + (step / steps) * delta).toFixed(precision); }
    function valueToStep(value) { return ((value - from) / delta * steps).toFixed(precision); }
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
        !$scope.$$phase && $scope.$apply(function() {
          $scope.model.upper = stepToValue(values[1]);
          $scope.model.lower = stepToValue(values[0]);
        });
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
  directive('barChart', function() {
  var margin = {top: 10, right: 20, bottom: 20, left: 60},
  width = 350 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  return {
    restrict:'E',
    scope: {
      val: '=',
      stacked: '='
    },
    link: function(scope, element, attrs) {
      function parseData(data) {
        var result = [];
        _.each(_.pairs(data), function(el) {
          var key = el[0];
          var values = el[1];
          for(var i = 0; i < values.length; i++) {
            var obj = result[i] || { key: "Rank " + (i + 1), values: [] };
            obj.values.push({x: key, y: values[i]});
            result[i] = obj;
          }
        });
        return result;
      }

      var svg = d3.select(element[0]).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
      scope.$watch('val', function(newVal, oldVal) {
        if(!newVal) return;
        nv.addGraph(function() {
          var chart = nv.models.multiBarChart();
          var data = parseData(newVal);

          chart.yAxis
            .tickFormat(d3.format(',.3f'));

          svg.datum(data)
            .transition().duration(100).call(chart);

          nv.utils.windowResize(chart.update);

          return chart;
        });
      });
    }
  }
}).
  directive('ordinalStep', function() {
  var w = 300, h = 300;
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'elicit-ordinal.html'
  };
}).
  directive('chooseMethodStep', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: { currentStep: '=' },
    templateUrl: 'choose-method.html'
  };
}).
  directive('ratioBoundStep', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'elicit-ratio-bound.html'
  };
});
