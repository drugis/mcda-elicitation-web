'use strict';
define(['lodash', 'angular'], function (_, angular) {
  var dependencies = ['$filter', 'WorkspaceSettingsService'];

  var EffectsTableService = function ($filter, WorkspaceSettingsService) {
    function buildEffectsTable(criteria) {
      var tableRows = angular.copy(criteria);
      var useFavorability = _.find(criteria, function (criterion) {
        return criterion.hasOwnProperty('isFavorable');
      });
      if (useFavorability) {
        var favorabilityHeader = {
          isHeaderRow: true,
          headerText: 'Favorable effects'
        };
        var unFavorabilityHeader = {
          isHeaderRow: true,
          headerText: 'Unfavorable effects'
        };
        var partition = _.partition(tableRows, ['isFavorable', true]);
        var orderedFavorableCriteria = partition[0];
        var orderedUnfavorableCriteria = partition[1];
        tableRows = [].concat(
          [favorabilityHeader],
          orderedFavorableCriteria,
          [unFavorabilityHeader],
          orderedUnfavorableCriteria
        );
      }
      tableRows = buildTableRows(tableRows);
      return tableRows;
    }

    function buildTableRows(rows) {
      return _.reduce(
        rows,
        function (accum, row) {
          if (row.isHeaderRow) {
            return accum.concat(row);
          }
          var criterion = _.omit(row, ['dataSources']);
          criterion.numberOfDataSources = row.dataSources.length;
          accum = accum.concat(createRow(row.dataSources, criterion));
          return accum;
        },
        []
      );
    }

    function createRow(dataSources, criterion) {
      return _.map(dataSources, function (dataSource, index) {
        var newDataSource = angular.copy(dataSource);
        newDataSource.scale = getScale(dataSource.scale);
        return {
          criterion: criterion,
          isFirstRow: index === 0,
          dataSource: newDataSource
        };
      });
    }

    function getScale(scale) {
      var newScale = [];
      if (_.isNull(scale[0])) {
        newScale[0] = -Infinity;
      } else {
        newScale[0] = scale[0];
      }
      if (_.isNull(scale[1])) {
        newScale[1] = Infinity;
      } else {
        newScale[1] = scale[1];
      }
      return newScale;
    }

    function getRoundedValue(value) {
      return $filter('number')(value);
    }

    function getRoundedScales(scales) {
      return _.mapValues(scales, function (scalesByAlternatives) {
        return _.mapValues(scalesByAlternatives, function (alternative) {
          return {
            '2.5%': getRoundedValue(alternative['2.5%']),
            '50%': getRoundedValue(alternative['50%']),
            '97.5%': getRoundedValue(alternative['97.5%'])
          };
        });
      });
    }

    function getMedian(scales) {
      if (
        WorkspaceSettingsService.setWorkspaceSettings().calculationMethod ===
        'mode'
      ) {
        return getMode(scales);
      } else {
        return getRoundedValue(scales['50%']);
      }
    }

    function getMode(scales) {
      if (scales.mode !== null && scales.mode !== undefined) {
        return getRoundedValue(scales.mode);
      } else {
        return 'NA';
      }
    }

    return {
      buildEffectsTable: buildEffectsTable,
      buildTableRows: buildTableRows,
      getRoundedValue: getRoundedValue,
      getRoundedScales: getRoundedScales,
      getMedian: getMedian
    };
  };

  return dependencies.concat(EffectsTableService);
});
