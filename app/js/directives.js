'use strict';
define([
  'lodash',
  'jquery',
  'angular',
  'd3',
  'nvd3'
],
  function(
    _,
    $,
    angular,
    d3,
    nv
  ) {
    var directives = angular.module('elicit.directives', []);

    function getParentDimension(element) {
      var width = parsePx($(element[0].parentNode).css('width'));
      var height = parsePx($(element[0].parentNode).css('height'));
      return {
        width: width,
        height: height
      };
    }

    function parsePx(str) {
      return parseInt(str.replace(/px/gi, ''));
    }

    function rankPlot() {
      return {
        restrict: 'E',
        scope: {
          stacked: '@',
          value: '=',
          problem: '='
        },
        link: function(scope, element, attrs) {
          var svg = d3.select(element[0]).append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

          scope.$watch('value', function(newVal) {
            if (!newVal) {
              return;
            } else {
              drawPlot(newVal);
            }
          }, true);

          function drawPlot(value) {
            var graphGenerator = createGraph(value);
            nv.addGraph(graphGenerator);
          }

          function createGraph(value) {
            return function(){
              var chart = nv.models.multiBarChart().height(400).width(400);
              var data = rankGraphData(value);
              
              chart.yAxis.tickFormat(d3.format(',.3g'));
              chart.stacked(attrs.stacked);
              chart.reduceXTicks(false);
              chart.staggerLabels(true);
              
              svg.datum(data)
              .transition().duration(100).call(chart);
              svg.style('background', 'white');
              
              nv.utils.windowResize(chart.update);
            };
          }

          function rankGraphData(data) {
            var result = [];
            _.each(_.toPairs(data), function(el) {
              var key = scope.problem.alternatives[el[0]].title;
              var values = el[1];
              for (var i = 0; i < values.length; i += 1) {
                var obj = result[i] || {
                  key: 'Rank ' + (i + 1),
                  values: []
                };
                obj.values.push({
                  x: key,
                  y: values[i]
                });
                result[i] = obj;
              }
            });
            return result;
          }
        }
      };
    }

    directives.directive('rankPlot', rankPlot);

    directives.directive('barChart', function() {
      return {
        restrict: 'E',
        scope: {
          value: '=',
          parseFn: '=',
          problem: '='
        },
        link: function(scope, element) {

          var dim = getParentDimension(element);

          var svg = d3.select(element[0]).append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

          function drawPlot(value) {
            nv.addGraph(function() {
              var chart = nv.models.discreteBarChart()
                .staggerLabels(false)
                .showValues(true)
                .staggerLabels(true)
                .width(dim.width)
                .x(function(d) {
                  return d.label;
                })
                .y(function(d) {
                  return d.value;
                });
              chart.tooltip.enabled(false);
              var data = (scope.parseFn && scope.parseFn(value)) || _.identity(value);
              svg.datum(data).transition().duration(100).call(chart);
              svg.style('background', 'white');

              nv.utils.windowResize(chart.update);
            });
          }

          scope.$watch('value', function(newVal) {
            if (!newVal) {
              return;
            } else {
              drawPlot(newVal);
            }
          }, true);
        }
      };
    });

    directives.directive('lineChart', function() {
      return {
        restrict: 'E',
        scope: {
          showLegend: '@',
          labelXAxis: '=',
          labelYAxis: '=',
          value: '=',
          parseFn: '=',
          yMargin: '='
        },
        link: function(scope, element, attrs) {
          var dim = getParentDimension(element);
          var svg = d3.select(element[0]).append('svg')
            .attr('width', '100%')
            .attr('height', '100%');
          scope.$watch('value', function(newVal) {
            if (!newVal) {
              svg.selectAll('g').remove();
              return;
            }
            var data = (scope.parseFn && scope.parseFn(newVal)) || _.identity(newVal);

            var chart = nv.models.lineChart().width(dim.width).height(dim.height);

            chart.useVoronoi(true);

            if (attrs.showLegend && attrs.showLegend === 'false') {
              chart.showLegend(false);
            }

            svg.style('background', 'white');
            svg.datum(data).call(chart);

            var hasLabels = _.every(data, function(x) {
              return !_.isUndefined(x.labels);
            });
            if (hasLabels) {
              chart.xAxis.tickFormat(function(i) {
                if (i % 1 === 0) {
                  return data[0].labels[i];
                } else {
                  return '';
                }
              });
            } else {
              var x = d3.scale.linear().domain(chart.xAxis.scale().domain());
              chart.xAxis.tickFormat(d3.format(',.3g'));
              chart.xAxis.tickValues(x.ticks(4));
              if (scope.labelXAxis) {
                chart.xAxis.axisLabel(scope.labelXAxis);
              }

              var yDomain = chart.yAxis.scale().domain();
              var y;
              if (scope.yMargin) {
                var scaledDomain = [yDomain[0] - 0.01 * yDomain[0], yDomain[1] + 0.01 * yDomain[1]];
                chart.forceY(scaledDomain);
                y = d3.scale.linear().domain(scaledDomain);
              } else {
                y = d3.scale.linear().domain(yDomain);
              }
              chart.yAxis.tickValues(y.ticks(6));
              chart.yAxis.tickFormat(d3.format(',.3g'));
              if (scope.labelYAxis) {
                chart.yAxis.axisLabel(scope.labelYAxis);
              }
              chart.dispatch.on('stateChange', function(event) {
                if (scope.yMargin) { // fugly code :(
                  var currentData = _.filter(data, function(dat, index) {
                    return !event.disabled[index];
                  });
                  var minY = _.min(_.reduce(currentData, function(accum, dat) {
                    return accum.concat(_.map(dat.values, function(value) {
                      return value.y;
                    }));
                  }, []));
                  var maxY = _.max(_.reduce(currentData, function(accum, dat) {
                    return accum.concat(_.map(dat.values, function(value) {
                      return value.y;
                    }));
                  }, []));
                  var scaledDomain = [minY - 0.01 * minY, maxY + 0.01 * maxY];
                  chart.forceY(scaledDomain);
                  var y = d3.scale.linear().domain(scaledDomain);
                  chart.yAxis.tickValues(y.ticks(6));
                  chart.update();
                }
              });
            }

            chart.update();
          });
        }
      };
    });

    directives.directive('heat', function() {
      return {
        restrict: 'C',
        replace: false,
        transclude: false,
        scope: false,
        link: function(scope, element) {
          scope.$watch(element, function() {
            var value = parseFloat(element[0].innerHTML);
            var color = d3.scale.quantile().range(d3.range(9)).domain([1, 0]);
            $(element[0].parentNode).addClass('RdYlGn');
            $(element[0]).addClass('q' + color(value) + '-9');
          });
        }
      };
    });

    directives.directive('fileReader', function() {
      return {
        scope: {
          model: '='
        },
        restrict: 'E',
        template: '<input id="workspace-upload-input" type="file" accept=".json">',
        link: function(scope, element) {
          function onLoadContents(env) {
            scope.$apply(function() {
              scope.model.contents = env.target.result;
            });
          }

          element.on('change', function(event) {
            scope.$apply(function(scope) {
              scope.model.file = event.target.files[0];
              if (!scope.model.file) {
                delete scope.model.contents;
                return;
              }

              var reader = new FileReader();
              reader.onload = onLoadContents;
              reader.readAsText(scope.model.file);
            });
          });
        }
      };
    });

    return directives;
  });
