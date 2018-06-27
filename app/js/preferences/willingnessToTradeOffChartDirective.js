'use strict';
define(['c3', 'd3', 'lodash'],
  function(c3, d3,_) {
    var dependencies = [
      'TradeOffService',
      'mcdaRootPath',
      '$timeout'
    ];
    var WillingnessToTradeOffChartDirective = function(
      TradeOffService,
      mcdaRootPath,
      $timeout
    ) {
      return {
        restrict: 'E',
        scope: {
          problem: '=',
          settings: '='
        },
        templateUrl: mcdaRootPath + 'js/preferences/willingnessToTradeOffChartDirective.html',
        link: function(scope, element) {
          scope.updateFirstPoint = updateFirstPoint;
          scope.updateSecondPoint = updateSecondPoint;

          scope.coordinates = {};
          var criteria;

          var chart;
          var data = {
            xs: {
              firstPoint: 'firstPoint_x',
              line: 'line_x',
              secondPoint: 'secondPoint_x'
            },
            columns: [],
            type: 'scatter',
            types: {
              line: 'line'
            }
          };
          var root = d3.select($(element).get(0));
          root = root.select('svg');

          scope.$watch('settings', function(newSettings) {
            if (newSettings) {
              initChart(newSettings);
              criteria = {
                firstCriterion: newSettings.firstCriterion,
                secondCriterion: newSettings.secondCriterion
              };
            }
          }, true);

          function initChart(newSettings) {
            root.append('rect')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('fill', 'white');
            root
              .style('width', '500px')
              .style('height', '500px')
              .style('background', 'white');
            scope.coordinates = {};
            scope.minX = newSettings.firstCriterion.dataSources[0].pvf.range[0];
            scope.maxX = newSettings.firstCriterion.dataSources[0].pvf.range[1];
            scope.minY = newSettings.secondCriterion.dataSources[0].pvf.range[0];
            scope.maxY = newSettings.secondCriterion.dataSources[0].pvf.range[1];

            var initialSettings = {
              bindto: root,
              data: data,
              axis: {
                x: {
                  ticks: 10,
                  min: scope.minX,
                  max: scope.maxX,
                  label: newSettings.firstCriterion.title,

                  padding: {
                    left: 0,
                    right: 0
                  }
                },
                y: {
                  ticks: 10,
                  min: scope.minY,
                  max: scope.maxY,
                  default: [scope.minY, scope.maxY],
                  label: newSettings.secondCriterion.title,
                  padding: {
                    top: 0,
                    bottom: 0
                  }
                }
              }
            };
            chart = c3.generate(initialSettings);

            chart.internal.main.on('click', clickHandler); // https://github.com/c3js/c3/issues/705

            function clickHandler() {
              var coords = d3.mouse(this);
              scope.coordinates.x = chart.internal.x.invert(coords[0]);
              scope.coordinates.y = chart.internal.y.invert(coords[1]);
              updateCoordinates();
              $timeout(); // force coordinate update outside chart
            }
          }

          function plotIndifference(results) {
            data.columns[2] = (['line_x'].concat(results.data.x));
            data.columns[3] = (['line'].concat(results.data.y));
          }

          function updateFirstPoint() {
            if (scope.coordinates.x > -Infinity && scope.coordinates.y > -Infinity) {
              scope.coordinates.x = scope.coordinates.x < scope.minX ? scope.minX : scope.coordinates.x;
              scope.coordinates.x = scope.coordinates.x > scope.maxX ? scope.maxX : scope.coordinates.x;
              scope.coordinates.y = scope.coordinates.y < scope.minY ? scope.minY : scope.coordinates.y;
              scope.coordinates.y = scope.coordinates.y > scope.maxY ? scope.maxY : scope.coordinates.y;
              updateCoordinates();
            }
          }
          function updateSecondPoint() {
            var bla = _.indexOf(data.columns[2], scope.coordinates.x2);
            var value;
            if (bla){
              value =data.columns[3][bla];
            }
            var xs = _.cloneDeep(data.columns[2]);
            xs.push(scope.coordinates.x2);
            xs = _.sortBy(xs);
            var idx = _.indexOf(xs, scope.coordinates.x2);
            if(idx > 0 && idx < xs.length - 1){ // it's first or last i.e. it's possible to be on the line
              var xdiff = data.columns[2][idx -1] - data.columns[2][idx];
              var ydiff = Math.abs(data.columns[3][idx -1] - data.columns[3][idx]);
              var slope = ydiff / xdiff;
              var constant = -slope * data.columns[2][idx]+data.columns[3][idx];
              value = slope * scope.coordinates.x2 + constant;
            }
            data.columns[4] = ['secondPoint', value];
            data.columns[5] = ['secondPoint_x', scope.coordinates.x2];
            chart.load(data);
            console.log(value);
            
            // calc y from x
            // add point
            // phrase and show sentence
          }

          function updateCoordinates() {
            data.columns[0] = ['firstPoint', scope.coordinates.y];
            data.columns[1] = ['firstPoint_x', scope.coordinates.x];
            chart.load(data);
            TradeOffService.getIndifferenceCurve(scope.problem, criteria, scope.coordinates).then(function(results) {
              plotIndifference(results);
              chart.load(data);
            });
          }

        }
      };
    };
    return dependencies.concat(WillingnessToTradeOffChartDirective);
  });
