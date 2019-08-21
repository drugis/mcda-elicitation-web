'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    '$q',
    'PataviResultsService',
    'significantDigits'
  ];

  var WorkspaceService = function(
    $q,
    PataviResultsService,
    significantDigits
  ) {
    function getObservedScales(problem) {
      var newProblem = createProblem(problem);
      return newProblem ? PataviResultsService.postAndHandleResults(newProblem) : $q.resolve(undefined);
    }

    function createProblem(problem) {
      var newProblem = angular.copy(problem);
      var dataSources = getDataSources(newProblem.criteria);
      newProblem.criteria = _.keyBy(dataSources, 'id');

      newProblem.performanceTable = createPerformanceTable(newProblem.performanceTable);
      newProblem.method = 'scales';
      return newProblem;
    }

    function createPerformanceTable(performanceTable) {
      return _.map(performanceTable, function(entry) {
        entry.criterion = entry.dataSource;
        entry.performance = entry.performance.distribution ? entry.performance.distribution : entry.performance.effect;
        return entry;
      });
    }

    function getDataSources(criteria) {
      return _.reduce(criteria, function(accum, criterion) {
        return accum.concat(criterion.dataSources);
      }, []);
    }

    function percentifyScales(criteria, observedScales) {
      var dataSources = _.keyBy(_.reduce(criteria, function(accum, criterion) {
        return accum.concat(criterion.dataSources);
      }, []), 'id');

      return _.reduce(observedScales, function(accum, scaleRow, datasourceId) {
        if (dataSources[datasourceId]) {
          accum[datasourceId] = _.reduce(scaleRow, function(accum, scaleCell, alternativeId) {
            var usePercentage = dataSources[datasourceId].unitOfMeasurement.type === 'percentage';
            accum[alternativeId] = usePercentage ? _.mapValues(scaleCell, times100) : scaleCell;
            return accum;
          }, {});
        }
        return accum;
      }, {});
    }

    function addTheoreticalScales(criteria) {
      return updateDataSources(criteria, addTheoreticalScale);
    }

    function percentifyCriteria(baseState) {
      var criteriaWithUpdatedDataSources = updateDataSources(baseState.problem.criteria, percentifyDataSource);
      return _.merge({}, baseState, {
        problem: {
          criteria: criteriaWithUpdatedDataSources
        }
      });
    }

    function updateDataSources(criteria, fn) {
      return _.mapValues(criteria, function(criterion) {
        return _.extend({}, criterion, {
          dataSources: _.map(criterion.dataSources, fn)
        });
      });
    }

    function addTheoreticalScale(dataSource) {
      return _.extend({}, dataSource, {
        scale: getScales(dataSource)
      });
    }

    function getScales(dataSource) {
      if (dataSource.scale) {
        var scale = angular.copy(dataSource.scale);
        scale[0] = scale[0] !== null ? scale[0] : -Infinity;
        scale[1] = scale[1] !== null ? scale[1] : Infinity;
        return scale;
      } else {
        return [-Infinity, Infinity];
      }
    }

    function percentifyDataSource(dataSource) {
      var newDataSource = angular.copy(dataSource);
      if (dataSource.unitOfMeasurement.type === 'decimal') {
        newDataSource.scale = [0, 100];
        newDataSource.unitOfMeasurement = {
          label: '%',
          type: 'percentage'
        };
        if (newDataSource.pvf) {
          if (newDataSource.pvf.range) {
            newDataSource.pvf.range = _.map(newDataSource.pvf.range, times100);
          }
          if (newDataSource.pvf.cutoffs) {
            newDataSource.pvf.cutoffs = _.map(newDataSource.pvf.cutoffs, times100);
          }
        }
      }
      return newDataSource;
    }

    function dePercentifyCriteria(baseState) {
      var criteriaWithUpdatedDataSources = updateDataSources(baseState.problem.criteria, dePercentifyDataSource);
      return _.merge({}, baseState, {
        problem: {
          criteria: criteriaWithUpdatedDataSources
        }
      });
    }

    function dePercentifyDataSource(dataSource) {
      var newDataSource = angular.copy(dataSource);
      if (dataSource.unitOfMeasurement.type === 'percentage') {
        newDataSource.scale = [0, 1];
        newDataSource.unitOfMeasurement = {
          type: 'decimal',
          label: 'Proportion'
        };
      }
      return newDataSource;
    }

    function times100(value) {
      if (value === null) { return; } //prevent empty cells from becoming 0
      return significantDigits(value * 100, 1);
    }

    function reduceProblem(problem) {
      var criteria = _.reduce(problem.criteria, function(accum, criterion, key) {
        accum[key] = _.pick(criterion, ['scale', 'pvf']);
        return accum;
      }, {});
      return {
        criteria: criteria
      };
    }

    function buildAggregateState(baseProblem, subProblem, scenario) {
      var newState = _.merge({}, {
        problem: mergeBaseAndSubProblem(baseProblem, subProblem.definition)
      }, scenario.state);
      newState.problem.preferences = scenario.state.prefs;
      newState.problem.criteria = _.mapValues(newState.problem.criteria, function(criterion, key) {
        return _.merge({}, criterion, _.omit(baseProblem.criteria[key], ['pvf', 'dataSources']));
        // omit because we don't want the base problem pvf to overwrite the current one
      });
      newState.problem.alternatives = _.mapValues(newState.problem.alternatives, function(alternative, key) {
        return _.merge({}, alternative, baseProblem.alternatives[key]);
      });
      newState.problem.criteria = addTheoreticalScales(newState.problem.criteria);
      return newState;
    }

    function setDefaultObservedScales(problem, observedScales) {
      var newProblem = _.cloneDeep(problem);
      _.forEach(newProblem.criteria, function(criterion) {
        var scale = observedScales[criterion.dataSources[0].id];
        criterion.dataSources[0].pvf = _.merge({
          range: getMinMax(scale)
        }, criterion.dataSources[0].pvf);
      });
      return newProblem;
    }

    function mergeBaseAndSubProblem(baseProblem, subProblemDefinition) {
      var newProblem = _.cloneDeep(baseProblem);
      if (subProblemDefinition.excludedCriteria) {
        newProblem.criteria = _.omit(newProblem.criteria, subProblemDefinition.excludedCriteria);
        newProblem.performanceTable = filterExcludedCriteriaEntries(newProblem, subProblemDefinition.excludedCriteria);
      }

      if (subProblemDefinition.excludedAlternatives) {
        newProblem.alternatives = filterExcludedAlternatives(newProblem, subProblemDefinition.excludedAlternatives);
        newProblem.performanceTable = filterExcludedAlternativesEntries(newProblem, subProblemDefinition.excludedAlternatives);
        newProblem.performanceTable = updateIncludedEntries(newProblem, subProblemDefinition);
      }

      if (subProblemDefinition.excludedDataSources) {
        newProblem.criteria = updateCriterionDataSources(newProblem, subProblemDefinition.excludedDataSources);
        newProblem.performanceTable = filterExcludedDataSourceEntries(newProblem, subProblemDefinition.excludedDataSources);
      }

      newProblem.criteria = createCriteriaWithRanges(newProblem, subProblemDefinition.ranges);
      return newProblem;
    }

    function createCriteriaWithRanges(problem, ranges) {
      return _.mapValues(problem.criteria, function(criterion) {
        var newCriterion = _.cloneDeep(criterion);
        newCriterion.dataSources = createDataSourcesWithRanges(newCriterion, ranges);
        return newCriterion;
      });
    }

    function createDataSourcesWithRanges(criterion, ranges) {
      return _.map(criterion.dataSources, function(dataSource) {
        var rangesForDataSource = getRanges(dataSource.id, ranges);
        return _.merge({}, dataSource, rangesForDataSource);
      });
    }

    function getRanges(dataSourceId, ranges) {
      if (ranges) {
        return ranges[dataSourceId];
      } else {
        return {};
      }
    }

    function filterExcludedDataSourceEntries(problem, excludedDataSources) {
      return _.reject(problem.performanceTable, function(tableEntry) {
        return _.includes(excludedDataSources, tableEntry.dataSource);
      });
    }

    function updateCriterionDataSources(problem, excludedDataSources) {
      return _.mapValues(problem.criteria, function(criterion) {
        var newCriterion = angular.copy(criterion);
        newCriterion.dataSources = filterDataSources(newCriterion.dataSources, excludedDataSources);
        return newCriterion;
      });
    }

    function filterDataSources(dataSources, excludedDataSources) {
      return _.filter(dataSources, function(dataSource) {
        return !_.includes(excludedDataSources, dataSource.id);
      });
    }

    function updateIncludedEntries(problem, subProblemDefinition) {
      return _.map(problem.performanceTable, function(entry) {
        if (!isAbsolutePerformance(entry)) {
          entry.performance.distribution.parameters.relative = updateRelative(entry.performance.distribution.parameters.relative, subProblemDefinition.excludedAlternatives);
        }
        return entry;
      });
    }

    function updateRelative(relative, excludedAlternatives) {
      return {
        cov: reduceCov(relative.cov, excludedAlternatives),
        mu: reduceMu(relative.mu, excludedAlternatives)
      };
    }

    function filterExcludedCriteriaEntries(problem, excludedCriteria) {
      return _.reject(problem.performanceTable, function(tableEntry) {
        return _.includes(excludedCriteria, tableEntry.criterionUri) ||
          _.includes(excludedCriteria, tableEntry.criterion); // addis/mcda standalone difference
      });
    }

    function filterExcludedAlternativesEntries(problem, excludedAlternative) {
      return _.reject(problem.performanceTable, function(tableEntry) {
        return _.includes(excludedAlternative, tableEntry.alternative);
      });
    }

    function filterExcludedAlternatives(problem, excludedAlternatives) {
      return _.pickBy(problem.alternatives, function(alternative, id) {
        return !_.includes(excludedAlternatives, id);
      });
    }

    function reduceCov(oldCov, names) {
      var newCov = _.cloneDeep(oldCov);
      _.forEach(names, function(name) {
        var idx = newCov.colnames.indexOf(name);
        newCov.colnames.splice(idx, 1);
        newCov.rownames.splice(idx, 1);
        newCov.data = reduceMatrix(newCov.data, idx);
      });
      return newCov;
    }

    function reduceMatrix(cov, idx) {
      var newCov = _.cloneDeep(cov);
      newCov.splice(idx, 1);
      _.forEach(newCov, function(row) {
        row = row.splice(idx, 1);
      });
      return newCov;
    }

    function reduceMu(mu, excludedAlternatives) {
      return _.reduce(mu, function(accum, muValue, key) {
        if (!_.includes(excludedAlternatives, key)) {
          accum[key] = muValue;
        }
        return accum;
      }, {});
    }

    function getMinMax(scales) {
      var minimum = Infinity;
      var maximum = -Infinity;
      _.forEach(scales, function(scale) {
        _.forEach(scale, function(value) {
          if (value !== null && value < minimum) {
            minimum = value;
          }
          if (value !== null && value > maximum) {
            maximum = value;
          }
        });
      });
      if (minimum === maximum) {
        minimum -= Math.abs(minimum) * 0.001;
        maximum += Math.abs(maximum) * 0.001;
      }
      return [minimum, maximum];
    }

    function filterScenariosWithResults(baseProblem, currentSubProblem, scenarios) {
      return _.filter(scenarios, function(scenario) {
        var state = buildAggregateState(baseProblem, currentSubProblem, scenario);
        return !_.find(state.problem.criteria, function(criterion) {
          return !criterion.dataSources[0].pvf || !criterion.dataSources[0].pvf.direction;
        });
      });
    }

    /*
     * workspace should have:
     * - title
     * - criteria
     * - alternatives
     * - performanceTable
     * optional:
     * - description
     * - preferences
     */
    function validateWorkspace(workspace) {
      var constraints = [
        missingProperties,
        tooFewCriteria,
        tooFewAlternatives,
        criterionLackingTitle,
        alternativeLackingTitle,
        performanceTableWithInvalidAlternative,
        performanceTableWithInvalidCriterion,
        performanceTableWithMissingData,
        preferencesWithUnfoundCriterion,
        mixedPreferenceTypes,
        inconsistentOrdinalPreferences,
        inconsistentExactPreferences,
        relativePerformanceLackingBaseline,
        relativePerformanceWithBadMu,
        relativePerformanceWithBadCov
      ];
      var triggeredConstraint;
      try {
        triggeredConstraint = _.find(constraints, function(constraint) {
          return constraint(workspace);
        });
      } catch (exception) {
        console.log(exception);
        return {
          isValid: false,
          errorMessage: 'Exception while reading problem. Please make sure the file follows the specifications as laid out in the manual'
        };
      }
      return {
        isValid: !triggeredConstraint,
        errorMessage: triggeredConstraint ? triggeredConstraint(workspace) : undefined
      };
    }

    function missingProperties(workspace) {
      var requiredProperties = [
        'title',
        'criteria',
        'alternatives',
        'performanceTable'
      ];

      var missingProperties = _.reject(requiredProperties, function(property) {
        return workspace[property];
      });

      if (missingProperties.length === 1) {
        return 'Missing workspace property: ' + missingProperties[0];
      } else if (missingProperties.length > 1) {
        return 'Missing workspace properties: ' + missingProperties.join(', ');
      }
    }

    function tooFewCriteria(workspace) {
      if (_.size(workspace.criteria) < 2) {
        return 'Two or more criteria required';
      }
    }

    function tooFewAlternatives(workspace) {
      if (_.size(workspace.alternatives) < 2) {
        return 'Two or more alternatives required';
      }
    }

    function performanceTableWithInvalidAlternative(workspace) {
      var entry = _.find(workspace.performanceTable, function(tableEntry) {
        return isAbsolutePerformance(tableEntry) && !workspace.alternatives[tableEntry.alternative];
      });
      if (entry) {
        return 'Performance table contains data for nonexistent alternative: "' + entry.alternative + '"';
      }
    }

    function performanceTableWithInvalidCriterion(workspace) {
      var entry = _.find(workspace.performanceTable, function(tableEntry) {
        return !workspace.criteria[tableEntry.criterion];
      });
      if (entry) {
        return 'Performance table contains data for nonexistent criterion: "' + entry.criterion + '"';
      }
    }

    function performanceTableWithMissingData(workspace) {
      var alternatives = _.keys(workspace.alternatives);
      var criteria = _.keys(workspace.criteria);
      var criteriaWithAbsolutePerformance = _.filter(criteria, function(criterion) {
        return _.find(workspace.performanceTable, function(tableEntry) {
          return tableEntry.criterion === criterion && isAbsolutePerformance(tableEntry);
        });
      });
      var critAltCombinations = _.reduce(criteriaWithAbsolutePerformance, function(acc, criterion) {
        return acc.concat(_.map(alternatives, function(alternative) {
          return {
            criterion: criterion,
            alternative: alternative
          };
        }));
      }, []);
      var missingPair = _.find(critAltCombinations, function(critAltCombo) {
        return !_.find(workspace.performanceTable, function(tableEntry) {
          return tableEntry.alternative === critAltCombo.alternative && tableEntry.criterion === critAltCombo.criterion;
        });
      });
      if (missingPair) {
        return 'Performance table is missing data for criterion "' + missingPair.criterion +
          '" and alternative "' + missingPair.alternative + '"';
      }
    }

    function preferencesWithUnfoundCriterion(workspace) {
      var crit;
      _.find(workspace.preferences, function(preference) {
        return _.find(preference.criteria, function(criterion) {
          if (!workspace.criteria[criterion]) {
            crit = criterion;
            return true;
          } else {
            return false;
          }
        });
      });
      if (crit) {
        return 'Preferences contain data for nonexistent criterion: "' + crit + '"';
      }
    }

    function mixedPreferenceTypes(workspace) {
      if (hasNoPreferences(workspace)) {
        return;
      }
      var firstType = workspace.preferences[0].type;
      if (_.some(workspace.preferences, function(preference) {
        return preference.type !== firstType;
      })) {
        return 'Preferences should all be the same type';
      }
    }

    function inconsistentOrdinalPreferences(workspace) {
      if (hasNoOrdinalPreferences(workspace)) {
        return;
      }
      var visitCount = createVisitCounts(workspace);
      if (
        hasWrongNumberOfPreferences(workspace) ||
        hasBadPath(workspace) ||
        hasBadCoverage(visitCount) ||
        hasBadVisitCount(visitCount)
      ) {
        return 'Inconsistent ordinal preferences';
      }
    }

    function hasBadVisitCount(visitCount) {
      var counts = createVisitCombinationCounts(visitCount);
      return counts.first !== 1 || counts.last !== 1;
    }

    function hasBadCoverage(visitCount) {
      return _.reduce(visitCount, function(accum, visits) {
        return accum || !((visits.to === 0 && visits.from === 1) ||
          (visits.to === 1 && visits.from === 1) ||
          (visits.to === 1 && visits.from === 0));
      }, false);
    }

    function createVisitCounts(workspace) {
      var visitCount = _.mapValues(workspace.criteria, function() {
        return {
          from: 0,
          to: 0
        };
      });
      return countVisits(workspace, visitCount);
    }

    function countVisits(workspace, visitCount) {
      return _.reduce(workspace.preferences, function(accum, preference) {
        var origin = preference.criteria[0];
        var destination = preference.criteria[1];
        ++accum[origin].from;
        ++accum[destination].to;
        return accum;
      }, visitCount);
    }

    function hasBadPath(workspace) {
      return _.find(workspace.preferences, function(preference, index) {
        var origin = preference.criteria[0];
        if (index > 0) {
          var previousDestination = workspace.preferences[index - 1].criteria[1];
          return origin !== previousDestination;
        }
      });
    }

    function createVisitCombinationCounts(visitCount) {
      var counts = {
        first: 0,
        last: 0,
      };
      return _.reduce(visitCount, function(accum, visits) {
        if (visits.to === 0 && visits.from === 1) {
          ++accum.first;
        } else if (visits.to === 1 && visits.from === 0) {
          ++accum.last;
        }
        return accum;
      }, counts);

    }

    function hasNoOrdinalPreferences(workspace) {
      return !workspace.preferences || _.isEmpty(workspace.preferences) || _.find(workspace.preferences, function(preference) {
        return preference.type !== 'ordinal';
      });
    }

    function hasWrongNumberOfPreferences(workspace) {
      return workspace.preferences.length !== _.size(workspace.criteria) - 1;
    }

    function inconsistentExactPreferences(workspace) {
      if (hasNoPreferences(workspace) || workspace.preferences[0].type !== 'exact swing') {
        return;
      }

      var first = workspace.preferences[0].criteria[0];
      if (_.find(workspace.preferences, function(preference) {
        return preference.criteria[0] !== first ||
          preference.criteria[0] === preference.criteria[1] ||
          preference.ratio > 1 ||
          preference.ratio <= 0;
      })) {
        return 'Inconsistent exact weighting preferences';
      }
    }

    function hasNoPreferences(workspace) {
      return !workspace.preferences || _.isEmpty(workspace.preferences);
    }

    function isAbsolutePerformance(tableEntry) {
      return tableEntry.performance.effect ||
        (tableEntry.performance.distribution &&
          tableEntry.performance.distribution.type.indexOf('relative') < 0);
    }

    function criterionLackingTitle(workspace) {
      var key;
      var crit = _.find(workspace.criteria, function(criterion, critKey) {
        key = critKey;
        return !criterion.title;
      });
      if (crit) {
        return 'Missing title for criterion: "' + key + '"';
      }
    }

    function alternativeLackingTitle(workspace) {
      var key;
      var alt = _.find(workspace.alternatives, function(alternative, critKey) {
        key = critKey;
        return !alternative.title;
      });
      if (alt) {
        return 'Missing title for alternative: "' + key + '"';
      }
    }

    function relativePerformanceLackingBaseline(workspace) {
      var entryLackingBaseline = _.find(workspace.performanceTable, function(tableEntry) {
        return !isAbsolutePerformance(tableEntry) && !tableEntry.performance.distribution.parameters.baseline;
      });
      if (entryLackingBaseline) {
        return 'Missing baseline for criterion: "' + entryLackingBaseline.criterion + '"';
      }
    }

    function relativePerformanceWithBadMu(workspace) {
      var missingAlternativeId;
      var entryWithBadMu = _.find(workspace.performanceTable, function(tableEntry) {
        return !isAbsolutePerformance(tableEntry) && _.find(_.keys(tableEntry.performance.distribution.parameters.relative.mu), function(alternativeId) {
          missingAlternativeId = alternativeId;
          return !workspace.alternatives[alternativeId];
        });
      });
      if (entryWithBadMu) {
        return 'The mu of the performance of criterion: "' + entryWithBadMu.criterion + '" refers to nonexistent alternative: "' + missingAlternativeId + '"';
      }
    }

    function relativePerformanceWithBadCov(workspace) {
      var alternativeKey;
      var entryWithBadCov = _.find(workspace.performanceTable, function(tableEntry) {
        return !isAbsolutePerformance(tableEntry) && (_.find(tableEntry.performance.distribution.parameters.relative.cov.rownames, function(rowVal) {
          alternativeKey = rowVal;
          return !workspace.alternatives[rowVal];
        }) || _.find(tableEntry.performance.distribution.parameters.relative.cov.colnames, function(colVal) {
          alternativeKey = colVal;
          return !workspace.alternatives[colVal];
        }));
      });
      if (entryWithBadCov) {
        return 'The covariance matrix of criterion: "' + entryWithBadCov.criterion + '" refers to nonexistent alternative: "' + alternativeKey + '"';
      }
    }

    function hasNoStochasticResults(aggregateState) {
      var isAllExact = !_.some(aggregateState.problem.performanceTable, function(tableEntry) {
        return tableEntry.performance.distribution && tableEntry.performance.distribution.type !== 'exact';
      });
      var isExactSwing = _.some(aggregateState.prefs, ['type', 'exact swing']);
      return isAllExact && isExactSwing;
    }


    function checkForMissingValuesInPerformanceTable(performanceTable) {
      return _.some(performanceTable, function(entry) {
        return entry.performance.effect && entry.performance.effect.type === 'empty' &&
          entry.performance.distribution && entry.performance.distribution.type === 'empty';
      });
    }

    return {
      getObservedScales: getObservedScales,
      percentifyScales: percentifyScales,
      reduceProblem: reduceProblem,
      buildAggregateState: buildAggregateState,
      mergeBaseAndSubProblem: mergeBaseAndSubProblem,
      setDefaultObservedScales: setDefaultObservedScales,
      filterScenariosWithResults: filterScenariosWithResults,
      validateWorkspace: validateWorkspace,
      addTheoreticalScales: addTheoreticalScales,
      percentifyCriteria: percentifyCriteria,
      dePercentifyCriteria: dePercentifyCriteria,
      hasNoStochasticResults: hasNoStochasticResults,
      checkForMissingValuesInPerformanceTable: checkForMissingValuesInPerformanceTable
    };
  };

  return dependencies.concat(WorkspaceService);
});
