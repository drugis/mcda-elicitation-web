'use strict';
define(function(require) {
  var _ = require('lodash');
  var $ = require('jQuery');
  var angular = require('angular');
  var d3 = require('d3');
  var nv = require('nvd3');

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

        var dim = getParentDimension(element);

        var rankGraphData = function(data) {
          var result = [];
          _.each(_.toPairs(data), function(el) {
            var key = scope.problem.alternatives[el[0]].title;
            var values = el[1];
            for (var i = 0; i < values.length; i+=1) {
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
        };

        scope.$watch('value', function(newVal) {
          if (!newVal) {
            return;
          }
          nv.addGraph(function() {
            var chart = nv.models.multiBarChart().height(dim.height).width(dim.width);
            var data = rankGraphData(newVal);

            chart.yAxis.tickFormat(d3.format(',.3g'));
            chart.stacked(attrs.stacked);
            chart.reduceXTicks(false);
            chart.staggerLabels(true);

            svg.datum(data)
              .transition().duration(100).call(chart);
            svg.style('background', 'white');
              
            nv.utils.windowResize(chart.update);
          });
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
              })              ;
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

          chart.useVoronoi(true);

          if (attrs.showLegend && attrs.showLegend === 'false') {
            chart.showLegend(false);
          }

          svg.datum(data).call(chart);
          svg.style('background', 'white');

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
            if(scope.labelXAxis) {
              chart.xAxis.axisLabel(scope.labelXAxis);
            }

            var y = d3.scale.linear().domain(chart.yAxis.scale().domain());
            chart.yAxis.tickValues(y.ticks(6));
            chart.yAxis.tickFormat(d3.format(',.3g'));
            if(scope.labelYAxis) {
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
          var MathJax = require('MathJax');
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

  directives.directive('modal', function(mcdaRootPath) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        model: '=',
        buttonText: '@'
      },
      link: function(scope, element) {
        if (!scope.model) {
          scope.model = {};
        }
        scope.bgStyle = function(show) {
          return show ? {
            'display': 'block'
          } : {
            'display': 'none'
          };
        };
        scope.fgStyle = function(show) {
          return show ? {
            'display': 'block',
            'visibility': 'visible',
            'width': Math.round(window.innerWidth * 0.8)
          } : {
            'display': 'none'
          };
        };

        scope.model.open = function() {
          scope.model.show = true;
        };
        scope.model.close = function() {
          scope.model.show = false;
        };
        scope.model.closeCancel = function() {
          scope.$emit('closeCancelModal', element);
          scope.model.close();
        };
      },
      templateUrl: mcdaRootPath + 'partials/modal.html'
    };
  });

  directives.directive('tradeOffs', function($filter, mcdaRootPath, PartialValueFunction, sortCriteriaWithW) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        problem: '=',
        preferences: '='
      },
      link: function(scope) {
        scope.pvf = PartialValueFunction;
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

  //treeview
  directives.directive('valueTree', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        children: '=',
        remarks: '='
      },
      template: '<ul><value-tree-item ng-repeat="item in children" item="item" remarks="remarks"></value-tree-item></ul>'
    };
  });

  directives.directive('valueTreeItem', function($compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        item: '=',
        remarks: '='
      },
      template: '<li>{{item.title}}<p ng-if="remarks"><span ng-if="!remarks[item.title]">None.</span>{{remarks[item.title]}}</p></li>',
      link: function(scope, element) {
        if (scope.item && angular.isArray(scope.item.children)) {
          element.append('<value-tree children="item.children" remarks="remarks"></value-tree>');
          $compile(element.contents())(scope);
        }
      }
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
        var c = scope.criterion;

        var hasDescription = !!c.description;
        var dimensionlessUnits = ['proportion'];
        var isDimensionless = !c.unitOfMeasurement || dimensionlessUnits.indexOf(c.unitOfMeasurement.toLowerCase()) !== -1;

        var text;
        if (hasDescription) {
          text = c.description.replace(/(\.$)/g, '') + ' (' + c.title + (!isDimensionless ? ', ' + c.unitOfMeasurement : '') + ')';
        } else {
          text = c.title + (!isDimensionless ? ' ' + c.unitOfMeasurement : '');

        }
        scope.text = text;
      },
      template: '<span>{{text}}</span>'
    };
  });

  directives.directive('rankAcceptabilityPlot', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=',
        parseFn: '=',
        problem: '='
      },
      link: function() {},
      template: '<div style="width: 400px; height: 400px"><rank-plot value="data" parse-fn="parseFn" stacked="true" problem="problem"></rank-plot></div>'
    };
  });

  return directives;
});
