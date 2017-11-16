'use strict';
define(['lodash', 'jQuery', 'angular', 'd3', 'nvd3', 'MathJax'],
  function(_, $, angular, d3, nv, MathJax) {

    var directives = angular.module('elicit.directives', []);

    var parsePx = function(str) {
      return parseInt(str.replace(/px/gi, ''));
    };

    var getParentDimension = function(element) {
      var width = parsePx($(element[0].parentNode).css('width'));
      var height = parsePx($(element[0].parentNode).css('height'));

      return {
        width: width,
        height: height
      };
    };

    directives.directive('rankPlot', function() {
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

          // var dim = getParentDimension(element);// using 400 400 atm

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

          function drawPlot(value) {
            nv.addGraph(function() {
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
            });
          }

          scope.$watch('problem', function(newProblem) {
            scope.problem = newProblem;
            drawPlot(scope.value);
          }, true);

          scope.$watch('value', function(newVal) {
            if (!newVal) {
              return;
            }
            drawPlot(newVal);
          });
        }
      };
    });


    directives.directive('barChart', function() {
      return {
        restrict: 'E',
        scope: {
          value: '=',
          parseFn: '='
        },
        link: function(scope, element) {

          var dim = getParentDimension(element);

          var svg = d3.select(element[0]).append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

          scope.$watch('value', function(newVal) {
            if (!newVal) {
              return;
            }
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
              var data = (scope.parseFn && scope.parseFn(newVal)) || _.identity(newVal);
              svg.datum(data).transition().duration(100).call(chart);
              svg.style('background', 'white');

              nv.utils.windowResize(chart.update);
            });
          });
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
          parseFn: '='
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

            chart.useVoronoi(true); //         ??

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

              var y = d3.scale.linear().domain(chart.yAxis.scale().domain());
              chart.yAxis.tickValues(y.ticks(6));
              chart.yAxis.tickFormat(d3.format(',.3g'));
              if (scope.labelYAxis) {
                chart.yAxis.axisLabel(scope.labelYAxis);
              }
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
        template: '<input type="file" accept=".json">',
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

    directives.directive('mathjaxBind', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          scope.$watch(attrs.mathjaxBind, function(value) {
            var $script = angular.element('<script type="math/tex">').html(value === undefined ? '' : value);
            element.html('');
            element.append($script);
            MathJax.Hub.Config({
              skipStartupTypeset: true,
              messageStyle: 'none',
              showMathMenu: false,
              'SVG': {
                font: 'Latin-Modern'
              }
            });
            MathJax.Hub.Queue(['Reprocess', MathJax.Hub, element[0]]);
          });
        }
      };
    });

    directives.directive('addisAlert', function(mcdaRootPath) {
      return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
          type: '@',
          close: '&'
        },
        link: function(scope, element) {
          scope.animatedClose = function() {
            $(element).fadeOut(200, function() {
              scope.close();
            });
          };
        },
        templateUrl: mcdaRootPath + 'partials/alert.html'
      };
    });

    directives.directive('tradeOffs', function($filter, mcdaRootPath, PartialValueFunctionService, sortCriteriaWithW) {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          problem: '=',
          preferences: '='
        },
        link: function(scope) {
          scope.pvf = PartialValueFunctionService;
          scope.criteria = sortCriteriaWithW(scope.problem.criteria);

          var w = function(criterionKey) {
            return _.find(scope.criteria, function(crit) {
              return crit.id === criterionKey;
            }).w;
          };

          scope.$watch('preferences', function(newValue) {
            var order = _.map(newValue, function(pref) {
              var crit = _.map(pref.criteria, w);
              if (pref.type === 'ordinal') {
                return crit[0] + ' & \\geq & ' + crit[1] + '\\\\';
              } else {
                return '';
              }
            });

            var ratios = _.map(newValue, function(pref) {
              var crit = _.map(pref.criteria, w);
              if (pref.type === 'ratio bound') {
                return '\\frac{' + crit[0] + '}{' + crit[1] + '} & \\in & [' +
                  $filter('number')(pref.bounds[0]) +
                  ', ' + $filter('number')(pref.bounds[1]) + '] \\\\';
              } else if (pref.type === 'exact swing') {
                return '\\frac{' + crit[0] + '}{' + crit[1] + '} & = & ' +
                  $filter('number')(pref.ratio) +
                  ' \\\\';
              } else {
                return '';
              }
            });

            scope.hasTradeoffs = !_.isEmpty(order);

            if (scope.hasTradeoffs) {
              scope.order = '\\begin{eqnarray} ' + _.reduce(order, function(memo, eqn) {
                return memo + eqn;
              }, '') + ' \\end{eqnarray}';
              scope.ratios = '\\begin{eqnarray} ' + _.reduce(ratios, function(memo, eqn) {
                return memo + eqn;
              }, '') + ' \\end{eqnarray}';
            }
          });
        },
        templateUrl: mcdaRootPath + 'partials/tradeOffs.html'
      };
    });

    directives.directive('criterion', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          criterion: '=of'
        },
        link: function(scope) {
          updateCriterionView(scope.criterion);
          scope.$watch('criterion', function(newValue) {
            updateCriterionView(newValue);
          });

          function updateCriterionView(criterion) {
            var hasDescription = !!criterion.description;
            var dimensionlessUnits = ['proportion'];
            var isDimensionless = !criterion.unitOfMeasurement ||
              dimensionlessUnits.indexOf(criterion.unitOfMeasurement.toLowerCase()) !== -1;
            var text;
            if (hasDescription) {
              text = criterion.description.replace(/(\.$)/g, '') + ' (' + criterion.title + (!isDimensionless ? ', ' + criterion.unitOfMeasurement : '') + ')';
            } else {
              text = criterion.title + (!isDimensionless ? ' ' + criterion.unitOfMeasurement : '');
            }
            scope.text = text;
          }
        },
        template: '<span>{{text}}</span>'
      };
    });

    directives.directive('rankAcceptabilityPlot', function() {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          problem: '='
        },
        link: function() {},
        template: '<div class="grid-x">' +
          '<div class="cell large-6">' +
          '<div export file-name="\'rank-acceptability-plot\'" style="width: 400px; height: 400px">' +
          '<ng-transclude></ng-transclude>' +
          '</div>' +
          '</div>' +
          '<div class="cell large-6"><table><thead><tr><th>Alternative</th><th>' +
          'In plot' +
          '</th></tr></thead>' +
          '<tbody><tr ng-repeat="alternative in problem.alternatives">' +
          '<td>{{::alternative.title}}</td>' +
          '<td><input type="text" ng-model="alternative.title"></td>' +
          '</tr>' +
          '</tbody>' +
          '</table></div>' +
          '</div>'
      };
    });

    return directives;
  });