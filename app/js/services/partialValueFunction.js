'use strict';
define(['angular', 'underscore'], function(angular, _) {
  return angular.module('elicit.pvfService', []).factory('PartialValueFunction', function() {
    var create = function(pvf) {
      var increasing = pvf.direction === "increasing";

      function extreme(idx1, idx2) {
        return function() {
          return increasing ? pvf.range[idx1] : pvf.range[idx2];
        };
      }

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

      var cutoffs = [pvf.range[0]].concat(pvf.cutoffs || []);
      cutoffs.push(pvf.range[1]);

      var values = [increasing ? 0.0 : 1.0].concat(pvf.values || []);
      values.push(increasing ? 1.0 : 0.0);

      var intervalInfo = function(idx) {
        return {
          "x0": cutoffs[idx - 1],
          "x1": cutoffs[idx],
          "v0": values[idx - 1],
          "v1": values[idx]
        };
      };

      var map = function(x) {
        var idx = findIndexOfFirstLargerElement(cutoffs, x);
        var i = intervalInfo(idx);
        return i.v0 + (x - i.x0) * ((i.v1 - i.v0) / (i.x1 - i.x0));
      };

      var inv = function(v) {
        var idx = !increasing ? findIndexOfFirstSmallerElement(values, v) : findIndexOfFirstLargerElement(values, v);
        var i = intervalInfo(idx);
        return i.x0 + (v - i.v0) * ((i.x1 - i.x0) / (i.v1 - i.v0));
      };
      return { map: map,
               inv: inv,
               best: extreme(1,0),
               worst: extreme(0,1) };
    };

    var attach = function(state) {
      function addPartialValueFunction(criterion) {
        if(criterion.pvf) {
          var pvf = create(criterion.pvf);

          criterion.pvf = _.extend(criterion.pvf, _.pick(pvf, 'map', 'inv'));
          _.extend(criterion, _.pick(pvf, 'best', 'worst'));

        }
      }
      angular.forEach(state.problem.criteria, addPartialValueFunction);
      return state;
    };

    var getXY = function(criterion) {
      var y = [1].concat(criterion.pvf.values || []).concat([0]);
      var best = criterion.best();
      var worst = criterion.worst();
      var x = [best].concat(criterion.pvf.cutoffs || []).concat([worst]);
      var values = _.map(_.zip(x, y), function(p) {
        return { x: p[0], y: p[1] };
      });
      return [ { key: "Piecewise PVF", values: values }];
    };

     return { create: create,
             attach: attach,
             getXY: getXY
           };
  });
});
