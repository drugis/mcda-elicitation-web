define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return angular.module('elicit.pvfService', []).factory('PartialValueFunction', function() {
    var sortNumber = function(a,b) { // Seriously
      return a - b;
    };

    var findIndexOfFirstLargerElement = function(arr, val) {
      return _.indexOf(arr, _.find(arr, function(elm) {
        return elm >= val;
      })) || 1;
    };

    var findIndexOfFirstSmallerElement = function(arr, val) {
      return _.indexOf(arr, _.find(arr, function(elm) {
        return elm <= val;
      })) || 1;
    };

    var pvf = function(criterion) {
      var pvf = criterion.pvf;
      var increasing = isIncreasing(criterion);

      var cutoffs = (pvf.cutoffs || []).slice();

      cutoffs = [pvf.range[0]].concat(cutoffs);

      cutoffs.push(pvf.range[1]);

      cutoffs.sort(sortNumber);

      var values = [increasing ? 0.0 : 1.0].concat(pvf.values || []);
      values.push(increasing ? 1.0 : 0.0);

      var atIndex = function(idx) {
        return {
          "x0": cutoffs[idx - 1],
          "x1": cutoffs[idx],
          "v0": values[idx - 1],
          "v1": values[idx]
        };
      };

      return {
        "isIncreasing": increasing,
        "values": values,
        "cutoffs": cutoffs,
        "atIndex": atIndex
      };
    };

    var map = function(criterion) {
      var f = pvf(criterion);
      return function(x) {
        var idx = findIndexOfFirstLargerElement(f.cutoffs, x);
        var i = f.atIndex(idx);
        return i.v0 + (x - i.x0) * ((i.v1 - i.v0) / (i.x1 - i.x0));
      };
    };

    var inv = function(criterion) {
      var f = pvf(criterion);
      return function(v) {
        var idx = !f.isIncreasing ? findIndexOfFirstSmallerElement(f.values, v) : findIndexOfFirstLargerElement(f.values, v);
        var i = f.atIndex(idx);
        return i.x0 + (v - i.v0) * ((i.x1 - i.x0) / (i.v1 - i.v0));
      };
    };

    var isIncreasing = function(criterion) {
      return criterion.pvf.direction === "increasing";
    };

    var best = function(criterion) {
      return isIncreasing(criterion) ? criterion.pvf.range[1] : criterion.pvf.range[0];
    };

    var worst = function(criterion) {
      return isIncreasing(criterion) ? criterion.pvf.range[0] : criterion.pvf.range[1];
    };

    var getBounds = function(criterion) {
      return [worst(criterion), best(criterion)].sort(function(a, b) {
        return a - b;
      });
    };

    var getXY = function(criterion) {
      var y = [1].concat(criterion.pvf.values || []).concat([0]);
      var x = [best(criterion)].concat(criterion.pvf.cutoffs || []).concat([worst(criterion)]);
      var values = _.map(_.zip(x, y), function(p) {
        return {
          x: p[0],
          y: p[1]
        };
      });
      return [{
        key: "Partial Value Function",
        values: values
      }];
    };

    return {
      isIncreasing: isIncreasing,
      map: map,
      inv: inv,
      best: best,
      worst: worst,
      getXY: getXY,
      getBounds: getBounds
    };
  });
});
