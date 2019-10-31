'use strict';
define([
  'd3',
  'c3'
],
  function(
    d3,
    c3
  ) {
    var dependencies = [];
    var PartialValuePlotDirective = function() {
      return {
        restrict: 'E',
        scope: {
          criterion: '=',
          height: '=',
          labels: '=',
          values: '=',
          width: '='
        },
        templateUrl: './partialValuePlotDirective.html',
        link: function(scope) {
          scope.$watch('values', function(newVal) {
            if (!newVal) {
              return;
            } else {
              var root = d3.select('#partial-value-plot-' + scope.criterion.id);
              root
                .style('width', scope.width)
                .style('height', scope.height);
              var settings = {
                bindto: root,
                data: {
                  x: 'x',
                  columns: scope.values
                },
                axis: {
                  x: {
                    min: scope.values[0][1],
                    max: scope.values[0][scope.values[0].length - 1],
                    padding: {
                      left: 0,
                      right: 0
                    },
                    tick: {
                      count: 5,
                      format: d3.format(',.3g')
                    }
                  },
                  y: {
                    min: 0,
                    max: 1,
                    padding: {
                      top: 0,
                      bottom: 0
                    },
                    tick: {
                      count: 5,
                      format: d3.format(',.3g')
                    }
                  }
                },
                point: {
                  show: false
                },
                legend: {
                  show: false
                }
              };

              if (scope.labels) {
                settings.axis.x.label = {
                  text: scope.criterion.title,
                  position: 'outer-center'
                };
                settings.axis.y.label = {
                  text: 'Utility of value',
                  position: 'outer-middle'
                };
              }

              c3.generate(settings);

              d3.selectAll('.c3-line')
                .style('stroke-width', '2px');
            }
          });
        }
      };
    };
    return dependencies.concat(PartialValuePlotDirective);
  });
