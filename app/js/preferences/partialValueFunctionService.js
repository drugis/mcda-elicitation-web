'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [];
  var PartialValueFunctionService = function() {
    // public
    function inv(criterion) {
      var f = pvf(criterion);
      return function(v) {
        var idx = !f.isIncreasing ? findIndexOfFirstSmallerElement(f.values, v) : findIndexOfFirstLargerElement(f.values, v);
        var i = f.atIndex(idx);
        return i.x0 + (v - i.v0) * ((i.x1 - i.x0) / (i.v1 - i.v0));
      };
    }

    function isIncreasing(dataSource) {
      return dataSource.pvf.direction === 'increasing';
    }

    function best(dataSource) {
      return isIncreasing(dataSource) ? dataSource.pvf.range[1] : dataSource.pvf.range[0];
    }

    function worst(dataSource) {
      return isIncreasing(dataSource) ? dataSource.pvf.range[0] : dataSource.pvf.range[1];
    }

    function getBounds(dataSource) {
      return [worst(dataSource), best(dataSource)].sort(function(a, b) {
        return a - b;
      });
    }

    function getXY(dataSource) {
      var newDataSource = sortByValues(angular.copy(dataSource));

      var y = [1].concat(newDataSource.pvf.values || []).concat([0]);
      var x = [best(newDataSource)].concat(newDataSource.pvf.cutoffs || []).concat([worst(newDataSource)]);

      var values = _.map(_.zip(x, y), function(p) {
        return {
          x: p[0],
          y: p[1]
        };
      });
      return [{
        key: 'Partial Value Function',
        values: values
      }];
    }

    function standardizeDataSource(dataSource) {
      var newDataSource = _.cloneDeep(dataSource);
      if (newDataSource.pvf.type === 'linear') {
        delete newDataSource.pvf.values;
        delete newDataSource.pvf.cutoffs;
      } else if (newDataSource.pvf.type === 'piecewise-linear') {
        newDataSource.pvf.cutoffs = _.sortBy(newDataSource.pvf.cutoffs);
        newDataSource.pvf.values = _.sortBy(newDataSource.pvf.values);
        if (newDataSource.pvf.direction === 'decreasing') {
          newDataSource.pvf.values.reverse();
        }
      }
      return newDataSource;
    }

    // private
    function findIndexOfFirstLargerElement(arr, val) {
      return _.indexOf(arr, _.find(arr, function(elm) {
        return elm >= val;
      })) || 1;
    }

    function findIndexOfFirstSmallerElement(arr, val) {
      return _.indexOf(arr, _.find(arr, function(elm) {
        return elm <= val;
      })) || 1;
    }

    function pvf(criterion) {
      var pvf = criterion.pvf;
      var increasing = isIncreasing(criterion);

      var cutoffs = pvf.cutoffs || [];
      cutoffs = [pvf.range[0]].concat(cutoffs);
      cutoffs.push(pvf.range[1]);

      var values = [increasing ? 0.0 : 1.0].concat(pvf.values || []);
      values.push(increasing ? 1.0 : 0.0);

      function atIndex(idx) {
        return {
          'x0': cutoffs[idx - 1],
          'x1': cutoffs[idx],
          'v0': values[idx - 1],
          'v1': values[idx]
        };
      }

      return {
        'isIncreasing': increasing,
        'values': values,
        'cutoffs': cutoffs,
        'atIndex': atIndex
      };
    }

    function sortByValues(dataSource) {
      /* sorts the values and cutoffs according to the values (y-axis)
       returns an object containing the values and cuttoffs */
      if (!dataSource.pvf.cutoffs || !dataSource.pvf.values) {
        return dataSource;
      }
      var newCutoffs = _.cloneDeep(dataSource.pvf.cutoffs);
      var newValues = _.cloneDeep(dataSource.pvf.values);

      var list = [];
      for (var j = 0; j < newCutoffs.length; j++) {
        list.push({ 'cutoff': newCutoffs[j], 'value': newValues[j] });
      }
      list.sort(function(a, b) {
        return ((b.value < a.value) ? - 1 : ((b.value === a.value) ? 0 : 1));
      });

      for (var k = 0; k < list.length; k++) {
        newCutoffs[k] = list[k].cutoff;
        newValues[k] = list[k].value;
      }
      dataSource.pvf.values = newValues;
      dataSource.pvf.cutoffs = newCutoffs;
      return dataSource;
    }

    return {
      isIncreasing: isIncreasing,
      inv: inv,
      best: best,
      worst: worst,
      getBounds: getBounds,
      getXY: getXY,
      standardizeDataSource: standardizeDataSource
    };
  };
  return dependencies.concat(PartialValueFunctionService);
});
