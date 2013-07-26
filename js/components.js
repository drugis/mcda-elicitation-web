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
    var stepToValue = function(step) { return (from + (step / steps) * delta).toFixed(precision); }
    function valueToStep(value) { return ((value - from) / delta * steps).toFixed(precision); }
    function getValue() { return valueToStep($scope.model.lower) + ";" + valueToStep($scope.model.upper); }

    $($element).empty();
    $($element).append('<input type="slider"></input>');
    $($element).find('input').attr("value", getValue());
    $($element).find('input').slider({
      from: 0,
      to: steps,
      step: 1,
      calculate: stepToValue,
      skin: "round_plastic",
      onstatechange: _.debounce(function(value) {
        var range = $scope.range;
        var steps = value.split(';');
        var values = _.map([stepToValue(steps[0]), stepToValue(steps[1])], parseFloat);

        function lessThan(a, b, epsilon) {
          return (a - b) < epsilon && Math.abs(a - b) > epsilon;
        }
        function greaterThan(a, b, epsilon) {
          return (a - b) > epsilon && Math.abs(a - b) > epsilon;
        }

        if (_.has(range, "restrictTo") && _.has(range, "restrictFrom")) {
          var slider = $($element).find('input');
          var epsilon = 0.001;
          var fromOutOfRange = greaterThan(values[0], range.restrictFrom, epsilon);
          var toOutOfRange = lessThan(values[1], range.restrictTo, epsilon);
          if (fromOutOfRange && toOutOfRange) {
            slider.slider("value", valueToStep(range.restrictFrom), valueToStep(range.restrictTo));
          } else if(fromOutOfRange) {
            slider.slider("value", valueToStep(range.restrictFrom), steps[1]);
          } else if(toOutOfRange) {
            slider.slider("value", steps[0], valueToStep(range.restrictTo));
          }
        }
        $scope.$root.$safeApply($scope, function() {
          $scope.model = { lower: values[0], upper: values[1] }
        });
      }, 50)
    });
    if (_.has($scope.range, "restrictTo") && _.has($scope.range, "restrictFrom")) {
      $($element).find('.jslider-bg').append('<i class="x"></i>');
      var width = valueToStep($scope.range.restrictTo) - valueToStep($scope.range.restrictFrom);
      var left = valueToStep($scope.range.restrictFrom);
      $($element).find('.jslider-bg .x').attr("style", "left: " + left + "%; width:" + width + "%");
    }
  };
  return {
    restrict: 'E',
    replace: true,
    scope: { model: '=', range: '=' },
    link: function($scope, $element) {
      var init = function() {
        if ($scope.range) {
          initialize($scope, $element);
        }
      }
      $scope.$watch('range', init, true);
      $scope.$watch('range.from', init, true);
      $scope.$watch('range.to', init, true);
    },
    template: '<div class="slider"></div>',
    replace: true
  };
}).
  directive('rankPlot', function() {
  return {
    restrict:'E',
    replace: true,
    scope: {
      value: '=',
      stacked: '@',
      problem: '='
    },
    link: function(scope, element, attrs) {
      function parsePx(str) { return parseInt(str.replace(/px/gi, '')) };

      var width = parsePx($(element[0].parentNode).css('width'));
      var height = parsePx($(element[0].parentNode).css('height'));

      var svg = d3.select(element[0]).append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

      var rankGraphData = function(data) {
        var result = [];
        _.each(_.pairs(data), function(el) {
          var key = scope.problem.alternatives[el[0]].title;
          var values = el[1];
          for(var i = 0; i < values.length; i++) {
            var obj = result[i] || { key: "Rank " + (i + 1), values: [] };
            obj.values.push({x: key, y: values[i]});
            result[i] = obj;
          }
        });
        return result;
      }

      scope.$watch('value', function(newVal, oldVal) {
        if(!newVal) return;
        nv.addGraph(function() {
          var chart = nv.models.multiBarChart().height(height).width(width);
          var data = rankGraphData(newVal);

          chart.yAxis.tickFormat(d3.format(',.3f'))
          chart.stacked(attrs.stacked);
          chart.reduceXTicks(false);
          chart.staggerLabels(true);

          svg.datum(data)
          .transition().duration(100).call(chart);

          nv.utils.windowResize(chart.update);
        });
      }, true);
    }
  }
}).
  directive('barChart', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      value: '=',
      parseFn: '='
    },
    link: function(scope, element, attrs) {
      function parsePx(str) { return parseInt(str.replace(/px/gi, '')) };

      var width = parsePx($(element[0].parentNode).css('width'));
      var height = parsePx($(element[0].parentNode).css('height'));
      var svg = d3.select(element[0]).append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

      scope.$watch('value', function(newVal, oldVal) {
        if(!newVal) return;
        nv.addGraph(function() {
          var chart = nv.models.discreteBarChart()
          .staggerLabels(false)
          .showValues(true)
          .height(height)
          .width(width)
          .tooltips(false)
          .x(function(d) { return d.label })
          .y(function(d) { return d.value });

          var data = (scope.parseFn && scope.parseFn(newVal)) || _.identity(newVal);
          svg.datum(data).transition().duration(100).call(chart);
          nv.utils.windowResize(chart.update);
        });
      }, true);
    }
  }
}).
  directive('lineChart', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      value: '=',
      parseFn: '='
    },
    link: function(scope, element, attrs) {
      function parsePx(str) { return parseInt(str.replace(/px/gi, '')) };

      var width = parsePx($(element[0].parentNode).css('width'));
      var height = parsePx($(element[0].parentNode).css('height'));
      var svg = d3.select(element[0]).append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

      scope.$watch('value', function(newVal, oldVal) {
        if(!newVal) return;
        var data = (scope.parseFn && scope.parseFn(newVal)) || _.identity(newVal);

        var chart = nv.models.lineChart().width(width).height(height);
        chart.forceY([0.0]);
        chart.xAxis.staggerLabels(false);
        if (_.every(data, function(x) { return !_.isUndefined(x.labels) })) {
          chart.xAxis.tickFormat(function(i, obj) {
            if (i % 1 === 0) {
              return data[0].labels[i];
            } else {
              return "";
            }
          });
        }

        svg.datum(data).call(chart);
        nv.utils.windowResize(chart.update);

      });
    }
  }
}).
  directive('heat', function() {
  return {
    restrict: 'C',
    replace: false,
    transclude: false,
    scope: false,
    link: function(scope, element, attrs) {
      scope.$watch(element, function() {
        var value = parseFloat(element[0].innerHTML);
        var color = d3.scale.quantile().range(d3.range(9)).domain([1, 0]);
        $(element[0].parentNode).addClass("RdYlGn");
        $(element[0]).addClass("q" + color(value) + "-9");
      }, true);
    }
  };
})
  .directive('fileReader', function ($compile) {
  return {
    scope: {
      file: '='
    },
    restrict: 'E',
    template: "<input type='file' onchange='angular.element(this).scope().upload(this)'>",
    link: function (scope, element, attrs) {
      scope.upload = function (element) {
        scope.$apply(function (scope) {
          scope.file = element.files[0];
        });
      };

      scope.$watch('file', function () {
        if (scope.file) {
          var reader = new FileReader();
          reader.onload = (function (file) {
            return function (env) {
              scope.$apply(function () {
                scope.file.contents = env.target.result;
              });
            }
          }(scope.file));
          reader.readAsText(scope.file);
        }
      }, true);
    }
  };
});
