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

    var safeApply = function(fn) {
      var phase = $scope.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        $scope.$apply(fn);
      }
    };

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
        var steps = value.split(';');
        var values = [parseFloat(stepToValue(steps[0])), parseFloat(stepToValue(steps[1]))];

        function lessThan(a, b) {
          var epsilon = 0.1;
          return (a - b) < epsilon && Math.abs(a - b) > epsilon;
        }
        function greaterThan(a, b) {
          var epsilon = 0.1;
          return (a - b) > epsilon && Math.abs(a - b) > epsilon;
        }

        if(greaterThan(values[0], $scope.range.restrictFrom)) {
          $($element).find('input').slider("value", valueToStep($scope.range.restrictFrom), steps[1]);
        }
        if(lessThan(values[1], $scope.range.restrictTo)) {
          $($element).find('input').slider("value", steps[0], valueToStep($scope.range.restrictTo));
        }
        safeApply(function() {
          $scope.model = { lower: values[0], upper: values[1] }
        });
      }, 100)
    });
  };
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
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
      var width = element[0].parentNode.clientWidth;
      var height = element[0].parentNode.clientHeight;

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

          svg.datum(data)
          .transition().duration(100).call(chart);

          nv.utils.windowResize(chart.update);

          return chart;
        });
      });
    }
  }
}).
  directive('barChart', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      value: '=',
      parseFn: '='
    },
    link: function(scope, element, attrs) {
      var width = element[0].parentNode.clientWidth;
      var height = element[0].parentNode.clientHeight;
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

          return chart;
        });
      });
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
      var width = element[0].parentNode.clientWidth;
      var height = element[0].parentNode.clientHeight;
      var svg = d3.select(element[0]).append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

      scope.$watch('value', function(newVal, oldVal) {
        if(!newVal) return;
        var data = (scope.parseFn && scope.parseFn(newVal)) || _.identity(newVal);

        var chart = nv.models.lineChart().width(width).height(height);
        chart.xAxis.staggerLabels(false);
        chart.xAxis.tickFormat(function(i, obj) {
          if (i % 1 === 0) {
            return data[0].labels[i];
          } else {
            return "";
          }
        });

        svg.datum(data).call(chart);
        nv.utils.windowResize(chart.update);

        return chart;

      });
    }
  }
}).
  directive('heat', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    scope: false,
    link: function(scope, element, attrs) {
      scope.$watch(element[0], function() {
        var value = parseFloat(element[0].innerHTML);
        var color = d3.scale.quantile().range(d3.range(9)).domain([1, 0]);
        $(element[0].parentNode).addClass("RdYlGn");
        $(element[0]).addClass("q" + color(value) + "-9");
      });
    }
  };
}).
  directive('scaleRangeStep', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'scale-range.html'
  };
}).
  directive('ordinalStep', function() {
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
}).
  directive('resultsStep', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { currentStep: '=', problem: '=' },
    controller: function($scope, $element) {
      var alternativeTitle = function(id) {
        return $scope.problem.alternatives[id].title;
      }

      $scope.centalWeightsData = function(data) {
        var result = [];
        _.each(_.pairs(data), function(alternative) {
          var values = _.map(_.pairs(alternative[1]), function(criterion, index) {
            return { x: index, label: criterion[0], y: criterion[1] };
          });
          var labels = _.map(_.pluck(values, 'label'), function(id) { return $scope.problem.criteria[id].title });
          result.push({key: alternativeTitle(alternative[0]), labels: labels, values: values});
        });
        return result;
      }

      var getAlterativesByRank = function(data, rank) {
        var values = _.map(_.pairs(data), function(alternative) {
          return {label: alternativeTitle(alternative[0]), value: alternative[1][rank] };
        });
        var name = "Alternatives for rank " + (rank + 1);
        return [{ key: name, values: values }];
      }
      var populateAlternativesByRank = function() {
        var results = $scope.currentStep.results;
        if(results) {
          $scope.alternativesByRank = getAlterativesByRank(results.ranks.data, $scope.selectedRank);
        }
      };
      $scope.$watch('selectedRank', populateAlternativesByRank);

      var getRanksByAlternative = function(data, alternative) {
        var values = [];
        _.each(data[alternative], function(rank, index) {
          values.push({ label: "Rank " + (index + 1), value: [rank] });
        });
        return [{ key: alternativeTitle(alternative), values: values }];
      }
      var populateRanksByAlternative = function() {
        var results = $scope.currentStep.results;
        if(results) {
          $scope.ranksByAlternative =
            getRanksByAlternative(results.ranks.data, $scope.selectedAlternative);
        }
      };
      $scope.$watch('selectedAlternative', populateRanksByAlternative);

      $scope.$watch('currentStep.results', function() {
        if($($element[0]).is(':visible')) {
          console.log("visible!");
          $scope.selectedAlternative = _.keys($scope.problem.alternatives || {})[0];
          $scope.selectedRank = 0;
          populateRanksByAlternative();
          populateAlternativesByRank();
        }
      });
    },
    templateUrl: 'results-page.html'
  };
});
