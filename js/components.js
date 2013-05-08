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
  width = 300 - margin.left - margin.right,
  height = 480 - margin.top - margin.bottom;
  return {
    restrict:'E',
    scope: {
      val: '=',
      stacked: '='
    },
    link: function(scope, element, attrs) {
      function parseData(data) {
        var result = _.map(_.pairs(data), function(el) {
          var key = el[0];
          var values = el[1];
          return _.map(_.pairs(values),
                       function(el) {
                         return { intervention: key, group: el[0], value: el[1] }
                       });
        });
        return _.flatten(result);
      }

      var y0 = d3.scale.ordinal()
      .rangeRoundBands([height, 0], .2);

      var y1 = d3.scale.linear();

      var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1, 0);

      var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

      var nest = d3.nest()
      .key(function(d) { return d.group; });

      var stack = d3.layout.stack()
      .values(function(d) { return d.values; })
      .x(function(d) { return d.intervention; })
      .y(function(d) { return d.value; })
      .out(function(d, y0) { d.valueOffset = y0; });

      var color = d3.scale.category10();

      var svg = d3.select(element[0]).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      scope.$watch('val', function(newVal, oldVal) {
        svg.selectAll('*').remove();
        if(!newVal) return;

        var data = parseData(newVal);
        var dataByGroup = nest.entries(data);

        stack(dataByGroup);
        x.domain(dataByGroup[0].values.map(function(d) { return d.intervention; }));
        y0.domain(dataByGroup.map(function(d) { return d.key; }));
        y1.domain([0, d3.max(data, function(d) { return d.value; })]).range([y0.rangeBand(), 0]);

        var group = svg.selectAll(".group")
        .data(dataByGroup)
        .enter().append("g")
        .attr("class", "group")
        .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

        group.append("text")
        .attr("class", "group-label")
        .attr("x", -6)
        .attr("y", function(d) { return y1(d.values[0].value / 2); })
        .attr("dy", ".35em")
        .text(function(d) {
          if(d.key == 1) {
            return "Best"
          } else if(d.key == dataByGroup.length) {
            return "Worst"
          } else {
            return null;
          }
        });

        var bars = group.selectAll("g.bar")
        .data(function(d) { return d.values; })
        .enter().append("g")
        .attr("class", "bar");

        bars.append("rect")
        .style("fill", function(d) { return color(d.group); })
        .attr("x", function(d) { return x(d.intervention); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y1(d.value); })
        .attr("height", function(d) { return y0.rangeBand() - y1(d.value); });


        group.filter(function(d, i) { return !i; }).append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y0.rangeBand() + ")")
        .call(xAxis);
      });

      scope.$watch('stacked', function(newVal, oldVal) {
        if(newVal === oldVal) return;
        if (newVal === "multiples") transitionMultiples();
        else transitionStacked();
      });

      function transitionMultiples() {
        var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
        g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
        g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
      }

      function transitionStacked() {
        var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
        g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
        g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); })
      }
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
