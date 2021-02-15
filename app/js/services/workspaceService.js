'use strict';
define(['lodash', 'angular'], function (_, angular) {
  var dependencies = [];

  var WorkspaceService = function () {
    function buildAggregateState(baseProblem, subProblem, scenario) {
      var newState = _.merge(
        {},
        {
          problem: mergeBaseAndSubProblem(baseProblem, subProblem.definition)
        },
        scenario.state
      );
      newState.problem.preferences = scenario.state.prefs;
      newState.problem.criteria = _.mapValues(
        newState.problem.criteria,
        function (criterion, criterionId) {
          return _.merge(
            {},
            criterion,
            _.omit(baseProblem.criteria[criterionId], ['pvf', 'dataSources'])
          );
          // omit because we don't want the base problem pvf to overwrite the current one
        }
      );
      newState.problem.alternatives = _.mapValues(
        newState.problem.alternatives,
        function (alternative, key) {
          return _.merge({}, alternative, baseProblem.alternatives[key]);
        }
      );
      newState.problem.criteria = addTheoreticalScales(
        newState.problem.criteria
      );
      return newState;
    }
    function addTheoreticalScales(criteria) {
      return updateDataSources(criteria, addTheoreticalScale);
    }

    function updateDataSources(criteria, fn) {
      return _.mapValues(criteria, function (criterion) {
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

    function mergeBaseAndSubProblem(baseProblem, subProblemDefinition) {
      var newProblem = _.cloneDeep(baseProblem);
      if (subProblemDefinition.excludedCriteria) {
        newProblem.criteria = _.omit(
          newProblem.criteria,
          subProblemDefinition.excludedCriteria
        );
        newProblem.performanceTable = filterExcludedCriteriaEntries(
          newProblem,
          subProblemDefinition.excludedCriteria
        );
      }

      if (subProblemDefinition.excludedAlternatives) {
        newProblem.alternatives = filterExcludedAlternatives(
          newProblem,
          subProblemDefinition.excludedAlternatives
        );
        newProblem.performanceTable = filterExcludedAlternativesEntries(
          newProblem,
          subProblemDefinition.excludedAlternatives
        );
        newProblem.performanceTable = updateIncludedEntries(
          newProblem,
          subProblemDefinition
        );
      }

      if (subProblemDefinition.excludedDataSources) {
        newProblem.criteria = updateCriterionDataSources(
          newProblem,
          subProblemDefinition.excludedDataSources
        );
        newProblem.performanceTable = filterExcludedDataSourceEntries(
          newProblem,
          subProblemDefinition.excludedDataSources
        );
      }

      newProblem.criteria = createCriteriaWithRanges(
        newProblem,
        subProblemDefinition.ranges
      );
      return newProblem;
    }

    function createCriteriaWithRanges(problem, ranges) {
      return _.mapValues(problem.criteria, function (criterion) {
        var newCriterion = _.cloneDeep(criterion);
        newCriterion.dataSources = createDataSourcesWithRanges(
          newCriterion,
          ranges
        );
        return newCriterion;
      });
    }

    function createDataSourcesWithRanges(criterion, ranges) {
      return _.map(criterion.dataSources, function (dataSource) {
        var rangesForDataSource = getRanges(dataSource.id, ranges);
        return _.merge({}, dataSource, rangesForDataSource);
      });
    }

    function getRanges(dataSourceId, ranges) {
      if (ranges) {
        return {pvf: {range: ranges[dataSourceId]}};
      } else {
        return {};
      }
    }

    function filterExcludedDataSourceEntries(problem, excludedDataSources) {
      return _.reject(problem.performanceTable, function (tableEntry) {
        return _.includes(excludedDataSources, tableEntry.dataSource);
      });
    }

    function updateCriterionDataSources(problem, excludedDataSources) {
      return _.mapValues(problem.criteria, function (criterion) {
        var newCriterion = angular.copy(criterion);
        newCriterion.dataSources = filterDataSources(
          newCriterion.dataSources,
          excludedDataSources
        );
        return newCriterion;
      });
    }

    function filterDataSources(dataSources, excludedDataSources) {
      return _.filter(dataSources, function (dataSource) {
        return !_.includes(excludedDataSources, dataSource.id);
      });
    }

    function updateIncludedEntries(problem, subProblemDefinition) {
      return _.map(problem.performanceTable, function (entry) {
        if (!isAbsolutePerformance(entry)) {
          entry.performance.distribution.parameters.relative = updateRelative(
            entry.performance.distribution.parameters.relative,
            subProblemDefinition.excludedAlternatives
          );
        }
        return entry;
      });
    }

    function updateRelative(relative, excludedAlternatives) {
      return {
        ...relative,
        cov: reduceCov(relative.cov, excludedAlternatives),
        mu: reduceMu(relative.mu, excludedAlternatives)
      };
    }

    function filterExcludedCriteriaEntries(problem, excludedCriteria) {
      return _.reject(problem.performanceTable, function (tableEntry) {
        return (
          _.includes(excludedCriteria, tableEntry.criterionUri) ||
          _.includes(excludedCriteria, tableEntry.criterion)
        ); // addis/mcda standalone difference
      });
    }

    function filterExcludedAlternativesEntries(problem, excludedAlternative) {
      return _.reject(problem.performanceTable, function (tableEntry) {
        return _.includes(excludedAlternative, tableEntry.alternative);
      });
    }

    function filterExcludedAlternatives(problem, excludedAlternatives) {
      return _.pickBy(problem.alternatives, function (alternative, id) {
        return !_.includes(excludedAlternatives, id);
      });
    }

    function reduceCov(oldCov, excludedAlternatives) {
      var newCov = _.cloneDeep(oldCov);
      _.forEach(excludedAlternatives, function (excludedAlternativeId) {
        var idx = newCov.colnames.indexOf(excludedAlternativeId);
        newCov.colnames.splice(idx, 1);
        newCov.rownames.splice(idx, 1);
        newCov.data = reduceMatrix(newCov.data, idx);
      });
      return newCov;
    }

    function reduceMatrix(matrix, idx) {
      var newCov = _.cloneDeep(matrix);
      newCov.splice(idx, 1);
      _.forEach(newCov, function (row) {
        row = row.splice(idx, 1);
      });
      return newCov;
    }

    function reduceMu(mu, excludedAlternatives) {
      return _.reduce(
        mu,
        function (accum, muValue, key) {
          if (!_.includes(excludedAlternatives, key)) {
            accum[key] = muValue;
          }
          return accum;
        },
        {}
      );
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
        triggeredConstraint = _.find(constraints, function (constraint) {
          return constraint(workspace);
        });
      } catch (exception) {
        console.log(exception);
        return {
          isValid: false,
          errorMessage:
            'Exception while reading problem. Please make sure the file follows the specifications as laid out in the manual'
        };
      }
      return {
        isValid: !triggeredConstraint,
        errorMessage: triggeredConstraint
          ? triggeredConstraint(workspace)
          : undefined
      };
    }

    function missingProperties(workspace) {
      var requiredProperties = [
        'title',
        'criteria',
        'alternatives',
        'performanceTable'
      ];

      var missingProperties = _.reject(requiredProperties, function (property) {
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
      var entry = _.find(workspace.performanceTable, function (tableEntry) {
        return (
          isAbsolutePerformance(tableEntry) &&
          !workspace.alternatives[tableEntry.alternative]
        );
      });
      if (entry) {
        return (
          'Performance table contains data for nonexistent alternative: "' +
          entry.alternative +
          '"'
        );
      }
    }

    function performanceTableWithInvalidCriterion(workspace) {
      var entry = _.find(workspace.performanceTable, function (tableEntry) {
        return !workspace.criteria[tableEntry.criterion];
      });
      if (entry) {
        return (
          'Performance table contains data for nonexistent criterion: "' +
          entry.criterion +
          '"'
        );
      }
    }

    function performanceTableWithMissingData(workspace) {
      var alternatives = _.keys(workspace.alternatives);
      var criteria = _.keys(workspace.criteria);
      var criteriaWithAbsolutePerformance = _.filter(
        criteria,
        function (criterion) {
          return _.find(workspace.performanceTable, function (tableEntry) {
            return (
              tableEntry.criterion === criterion &&
              isAbsolutePerformance(tableEntry)
            );
          });
        }
      );
      var critAltCombinations = _.reduce(
        criteriaWithAbsolutePerformance,
        function (acc, criterion) {
          return acc.concat(
            _.map(alternatives, function (alternative) {
              return {
                criterion: criterion,
                alternative: alternative
              };
            })
          );
        },
        []
      );
      var missingPair = _.find(critAltCombinations, function (critAltCombo) {
        return !_.find(workspace.performanceTable, function (tableEntry) {
          return (
            tableEntry.alternative === critAltCombo.alternative &&
            tableEntry.criterion === critAltCombo.criterion
          );
        });
      });
      if (missingPair) {
        return (
          'Performance table is missing data for criterion "' +
          missingPair.criterion +
          '" and alternative "' +
          missingPair.alternative +
          '"'
        );
      }
    }

    function preferencesWithUnfoundCriterion(workspace) {
      var crit;
      _.find(workspace.preferences, function (preference) {
        return _.find(preference.criteria, function (criterion) {
          if (!workspace.criteria[criterion]) {
            crit = criterion;
            return true;
          } else {
            return false;
          }
        });
      });
      if (crit) {
        return (
          'Preferences contain data for nonexistent criterion: "' + crit + '"'
        );
      }
    }

    function mixedPreferenceTypes(workspace) {
      if (hasNoPreferences(workspace)) {
        return;
      }
      var firstType = workspace.preferences[0].type;
      if (
        _.some(workspace.preferences, function (preference) {
          return preference.type !== firstType;
        })
      ) {
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
      return _.reduce(
        visitCount,
        function (accum, visits) {
          return (
            accum ||
            !(
              (visits.to === 0 && visits.from === 1) ||
              (visits.to === 1 && visits.from === 1) ||
              (visits.to === 1 && visits.from === 0)
            )
          );
        },
        false
      );
    }

    function createVisitCounts(workspace) {
      var visitCount = _.mapValues(workspace.criteria, function () {
        return {
          from: 0,
          to: 0
        };
      });
      return countVisits(workspace, visitCount);
    }

    function countVisits(workspace, visitCount) {
      return _.reduce(
        workspace.preferences,
        function (accum, preference) {
          var origin = preference.criteria[0];
          var destination = preference.criteria[1];
          ++accum[origin].from;
          ++accum[destination].to;
          return accum;
        },
        visitCount
      );
    }

    function hasBadPath(workspace) {
      return _.find(workspace.preferences, function (preference, index) {
        var origin = preference.criteria[0];
        if (index > 0) {
          var previousDestination =
            workspace.preferences[index - 1].criteria[1];
          return origin !== previousDestination;
        }
      });
    }

    function createVisitCombinationCounts(visitCount) {
      var counts = {
        first: 0,
        last: 0
      };
      return _.reduce(
        visitCount,
        function (accum, visits) {
          if (visits.to === 0 && visits.from === 1) {
            ++accum.first;
          } else if (visits.to === 1 && visits.from === 0) {
            ++accum.last;
          }
          return accum;
        },
        counts
      );
    }

    function hasNoOrdinalPreferences(workspace) {
      return (
        !workspace.preferences ||
        _.isEmpty(workspace.preferences) ||
        _.find(workspace.preferences, function (preference) {
          return preference.type !== 'ordinal';
        })
      );
    }

    function hasWrongNumberOfPreferences(workspace) {
      return workspace.preferences.length !== _.size(workspace.criteria) - 1;
    }

    function inconsistentExactPreferences(workspace) {
      if (
        hasNoPreferences(workspace) ||
        workspace.preferences[0].type !== 'exact swing'
      ) {
        return;
      }

      var first = workspace.preferences[0].criteria[0];
      if (
        _.find(workspace.preferences, function (preference) {
          return (
            preference.criteria[0] !== first ||
            preference.criteria[0] === preference.criteria[1] ||
            preference.ratio > 1 ||
            preference.ratio <= 0
          );
        })
      ) {
        return 'Inconsistent exact weighting preferences';
      }
    }

    function hasNoPreferences(workspace) {
      return !workspace.preferences || _.isEmpty(workspace.preferences);
    }

    function isAbsolutePerformance(tableEntry) {
      return (
        tableEntry.performance.effect ||
        (tableEntry.performance.distribution &&
          tableEntry.performance.distribution.type.indexOf('relative') < 0)
      );
    }

    function criterionLackingTitle(workspace) {
      var key;
      var crit = _.find(workspace.criteria, function (criterion, critKey) {
        key = critKey;
        return !criterion.title;
      });
      if (crit) {
        return 'Missing title for criterion: "' + key + '"';
      }
    }

    function alternativeLackingTitle(workspace) {
      var key;
      var alt = _.find(workspace.alternatives, function (alternative, critKey) {
        key = critKey;
        return !alternative.title;
      });
      if (alt) {
        return 'Missing title for alternative: "' + key + '"';
      }
    }

    function relativePerformanceLackingBaseline(workspace) {
      var entryLackingBaseline = _.find(
        workspace.performanceTable,
        function (tableEntry) {
          return (
            !isAbsolutePerformance(tableEntry) &&
            !tableEntry.performance.distribution.parameters.baseline
          );
        }
      );
      if (entryLackingBaseline) {
        return (
          'Missing baseline for criterion: "' +
          entryLackingBaseline.criterion +
          '"'
        );
      }
    }

    function relativePerformanceWithBadMu(workspace) {
      var missingAlternativeId;
      var entryWithBadMu = _.find(
        workspace.performanceTable,
        function (tableEntry) {
          return (
            !isAbsolutePerformance(tableEntry) &&
            _.find(
              _.keys(
                tableEntry.performance.distribution.parameters.relative.mu
              ),
              function (alternativeId) {
                missingAlternativeId = alternativeId;
                return !workspace.alternatives[alternativeId];
              }
            )
          );
        }
      );
      if (entryWithBadMu) {
        return (
          'The mu of the performance of criterion: "' +
          entryWithBadMu.criterion +
          '" refers to nonexistent alternative: "' +
          missingAlternativeId +
          '"'
        );
      }
    }

    function relativePerformanceWithBadCov(workspace) {
      var alternativeKey;
      var entryWithBadCov = _.find(
        workspace.performanceTable,
        function (tableEntry) {
          return (
            !isAbsolutePerformance(tableEntry) &&
            (_.find(
              tableEntry.performance.distribution.parameters.relative.cov
                .rownames,
              function (rowVal) {
                alternativeKey = rowVal;
                return !workspace.alternatives[rowVal];
              }
            ) ||
              _.find(
                tableEntry.performance.distribution.parameters.relative.cov
                  .colnames,
                function (colVal) {
                  alternativeKey = colVal;
                  return !workspace.alternatives[colVal];
                }
              ))
          );
        }
      );
      if (entryWithBadCov) {
        return (
          'The covariance matrix of criterion: "' +
          entryWithBadCov.criterion +
          '" refers to nonexistent alternative: "' +
          alternativeKey +
          '"'
        );
      }
    }

    function checkForMissingValuesInPerformanceTable(performanceTable) {
      return _.some(performanceTable, function (entry) {
        return (
          hasTextEffectWithoutDistribution(entry.performance) ||
          hasTextDistributionWithoutEffect(entry.performance) ||
          hasTextDistributionAndEffect(entry.performance)
        );
      });
    }

    function hasTextEffectWithoutDistribution(performance) {
      return (
        performance.effect &&
        performance.effect.type === 'empty' &&
        !performance.distribution
      );
    }

    function hasTextDistributionWithoutEffect(performance) {
      return (
        performance.distribution &&
        performance.distribution.type === 'empty' &&
        !performance.effect
      );
    }

    function hasTextDistributionAndEffect(performance) {
      return (
        performance.effect &&
        performance.effect.type === 'empty' &&
        performance.distribution &&
        performance.distribution.type === 'empty'
      );
    }

    return {
      buildAggregateState: buildAggregateState,
      checkForMissingValuesInPerformanceTable: checkForMissingValuesInPerformanceTable,
      validateWorkspace: validateWorkspace
    };
  };

  return dependencies.concat(WorkspaceService);
});
