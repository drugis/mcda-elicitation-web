'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [];
  var PartialValueFunctionService = function() {
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

    function getPvfCoordinates(criteria) {
      return _.mapValues(criteria, getPvfCoordinatesForCriterion);
    }

    function getPvfCoordinatesForCriterion(criterion) {
      var pvfCoordinates = [];
      var xValues = getXValues(criterion.dataSources[0]);
      pvfCoordinates.push(xValues);

      var yValues = getYValues(criterion);
      pvfCoordinates.push(yValues);

      return pvfCoordinates;
    }

    function getXValues(dataSource) {
      return [].concat(
        'x',
        best(dataSource),
        intermediateX(dataSource.pvf),
        worst(dataSource)
      );
    }

    function getYValues(criterion) {
      return [].concat(
        criterion.title,
        1,
        intermediateY(criterion.dataSources[0].pvf),
        0
      );
    }

    function intermediateX(pvf) {
      return pvf.cutoffs ? pvf.cutoffs : [];
    }

    function intermediateY(pvf) {
      return pvf.values ? pvf.values : [];
    }

    function standardizeDataSource(dataSource) {
      var newPvf = _.cloneDeep(dataSource.pvf);
      if (newPvf.type === 'linear') {
        delete newPvf.values;
        delete newPvf.cutoffs;
      } else if (newPvf.type === 'piecewise-linear') {
        newPvf.cutoffs = _.sortBy(newPvf.cutoffs);
        newPvf.values = _.sortBy(newPvf.values);
        if (newPvf.direction === 'decreasing') {
          newPvf.values.reverse();
        }
        if (dataSource.unitOfMeasurement.type === 'percentage') {
          newPvf.cutoffs = _.map(newPvf.cutoffs, div100);
        }
      }
      return {
        pvf: _.pick(newPvf, ['values', 'cutoffs', 'direction', 'type'])
      };
    }

    function div100(x) {
      return x / 100;
    }

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

    function getUnitOfMeasurement(criterion) {
      if (criterion.dataSources[0].unitOfMeasurement.type === 'decimal') {
        return '';
      } else {
        return ' ' + criterion.dataSources[0].unitOfMeasurement.label;
      }
    }

    return {
      isIncreasing: isIncreasing,
      inv: inv,
      best: best,
      worst: worst,
      getBounds: getBounds,
      standardizeDataSource: standardizeDataSource,
      getPvfCoordinates: getPvfCoordinates,
      getPvfCoordinatesForCriterion: getPvfCoordinatesForCriterion,
      getUnitOfMeasurement: getUnitOfMeasurement
    };
  };
  return dependencies.concat(PartialValueFunctionService);
});
