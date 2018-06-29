'use strict';
define(['lodash', 'd3', 'angular'], function(_, d3) {
  var dependencies = ['PataviResultsService'];
  var TradeOffService = function(PataviResultsService) {
    function getIndifferenceCurve(problem, criteria, coordinates) {
      var newProblem = _.merge({}, problem, {
        method: 'indifferenceCurve',
        indifferenceCurve: {
          criterionX: criteria.firstCriterion.id,
          criterionY: criteria.secondCriterion.id,
          x: coordinates.x,
          y: coordinates.y
        }
      });
      newProblem.criteria = _.mapValues(newProblem.criteria, function(criterion) {
        return _.merge({}, _.omit(criterion, ['dataSources']), _.omit(criterion.dataSources[0]), []);
      });
      return PataviResultsService.postAndHandleResults(newProblem);
    }

    function getInitialSettings(root, data, sliderOptions, settings, minY, maxY) {
      return {
        bindto: root,
        point: {
          r: function(point) {
            return point.id === 'line' ? 0 : 8;
          }
        },
        data: data,
        legend:{ item:{ onclick: function() {} } },
        axis: {
          x: {
            tick: {
              fit: false,
              format: d3.format('.2f')
            },
            min: sliderOptions.floor,
            max: sliderOptions.ceil,
            label: settings.firstCriterion.title,
            padding: {
              left: 0,
              right: 0
            }
          },
          y: {
            min: minY,
            max: maxY,
            default: [minY, maxY],
            tick: {
              format: d3.format('.2f')
            },
            label: settings.secondCriterion.title,
            padding: {
              top: 0,
              bottom: 0
            }
          }
        }
      };
    }

    function getYValue(x, xValues, yValues) {
      var value;
      var idx = _.indexOf(xValues, x);
      if (idx >= 0) {
        // value s same as one of the breakpoints, no need to calculate it
        value = yValues[idx];
      } else {
        var xCoordinates = _.cloneDeep(xValues);
        xCoordinates.push(x);
        xCoordinates = _.sortBy(xCoordinates);
        idx = _.indexOf(xCoordinates, x);
        if (idx === 1) {
          // not on the line, pick first point of the line
          x = xValues[1];
          value = yValues[1];
        } else if (idx === xCoordinates.length - 1) {
          // not on the line, pick last point of the line
          x = xValues[idx - 1];
          value = yValues[idx - 1];
        } else {
          // on the line, calculate y value
          var xdiff = xValues[idx] - xValues[idx - 1];
          var ydiff = yValues[idx] - yValues[idx - 1];
          var slope = ydiff / xdiff;
          var c = -slope * xValues[idx] + yValues[idx];
          value = slope * x + c;
        }
      }
      return {
        y: significantDigits(value),
        x: x
      };
    }

    function significantDigits(value) {
      if (value === 0) {
        return value;
      }
      var posOrNeg = value < 0 ? -1 : 1;
      var multiplier = Math.pow(10, 4 - Math.floor(Math.log(posOrNeg * value) / Math.LN10) - 1);
      return Math.round(value * multiplier) / multiplier;
    }

    return {
      getIndifferenceCurve: getIndifferenceCurve,
      getInitialSettings: getInitialSettings,
      getYValue: getYValue,
      significantDigits: significantDigits
    };
  };
  return dependencies.concat(TradeOffService);
});
