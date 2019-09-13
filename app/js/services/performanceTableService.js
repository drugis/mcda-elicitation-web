'use strict';
define(['lodash'], function(_) {
  var dependencies = [
  ];

  var ScaleRangeService = function(
  ) {
    function getEffectValues(performanceTable, dataSource) {
      return _.reduce(performanceTable, function(accum, entry) {
        if (entry.dataSource === dataSource.id && entry.performance.effect && entry.performance.effect.type !== 'empty') {
          var factor = dataSource.unitOfMeasurement.type === 'percentage' ? 100 : 1;
          accum.push(entry.performance.effect.value * factor);
        }
        return accum;
      }, []);
    }

    function getRangeDistributionValues(performanceTable, dataSource) {
      return _.reduce(performanceTable, function(accum, entry) {
        if (hasRangeDistribution(entry, dataSource.id) ) {
          var factor = dataSource.unitOfMeasurement.type === 'percentage' ? 100 : 1;
          accum.push(entry.performance.distribution.parameters.lowerBound * factor);
          accum.push(entry.performance.distribution.parameters.upperBound * factor);
        }
        return accum;
      }, []);
    }

    function hasRangeDistribution(entry, dataSourceId) {
      return entry.dataSource === dataSourceId &&
        entry.performance.distribution &&
        entry.performance.distribution.type === 'range';
    }

    return {
      getEffectValues: getEffectValues,
      getRangeDistributionValues: getRangeDistributionValues,
    };
  };

  return dependencies.concat(ScaleRangeService);
});
