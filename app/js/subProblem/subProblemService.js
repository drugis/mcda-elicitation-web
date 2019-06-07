'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [];
  var SubProblemService = function() {
    function createSubProblemCommand(subProblemState, choices, problem) {
      return {
        definition: createDefinition(subProblemState, choices),
        title: subProblemState.title,
        scenarioState: createDefaultScenarioState(problem, subProblemState)
      };
    }

    function createDefaultScenarioState(problem, subProblemState) {
      return {
        prefs: filterToObject(problem.preferences, subProblemState.criterionInclusions)
      };
    }

    function createDefinition(subProblemState, scales) {
      return {
        ranges: createRanges(scales, subProblemState.dataSourceInclusions),
        excludedCriteria: _.keys(_.omitBy(subProblemState.criterionInclusions)), // values are boolean
        excludedAlternatives: _.keys(_.omitBy(subProblemState.alternativeInclusions)),
        excludedDataSources: _.keys(_.omitBy(subProblemState.dataSourceInclusions))
      };
    }

    function determineBaseline(performanceTable, alternatives) {
      var alternativeKeys = _.keys(alternatives);
      return _.reduce(performanceTable, function(accum, performanceEntry) {
        if (performanceEntry.performance.parameters && performanceEntry.performance.parameters.baseline) {
          _.forEach(alternativeKeys, function(key) {
            if (key === performanceEntry.performance.parameters.baseline.name) {
              accum[key] = true;
            }
          });
        }
        return accum;
      }, {});
    }

    function filterToObject(objects, inclusions) {
      var returnObject = {};
      _.forEach(objects, function(object, objectKey) {
        if (inclusions[objectKey]) {
          returnObject[objectKey] = object;
        }
      });
      return returnObject;
    }

    function checkScaleRanges(criteria) {
      var isMissingScaleRange = _.find(criteria, function(criterion) {
        return !(criterion.dataSources[0].pvf && criterion.dataSources[0].pvf.range &&
          criterion.dataSources[0].pvf.range[0] !== undefined && criterion.dataSources[0].pvf.range[1] !== undefined);
      });
      return !isMissingScaleRange;
    }

    function excludeDataSourcesForExcludedCriteria(criteria, subProblemState) {
      return _.reduce(criteria, function(accum, criterion, criterionId) {
        if (!subProblemState.criterionInclusions[criterionId]) {
          _.forEach(criterion.dataSources, function(dataSource) {
            accum[dataSource.id] = false;
          });
        } else if (!_.find(criterion.dataSources, function(dataSource) {
          return subProblemState.dataSourceInclusions[dataSource.id];
        })) {
          _.forEach(criterion.dataSources, function(dataSource) {
            accum[dataSource.id] = true;
          });
        } else {
          accum = _.merge({}, accum, _.pick(subProblemState.dataSourceInclusions,
            _.map(criterion.dataSources, 'id')));
        }
        return accum;
      }, {});
    }

    function createInclusions(whatToInclude, definition, exclusionKey) {
      return _.reduce(_.keys(whatToInclude), function(accum, id) {
        var isIncluded = definition && !_.includes(definition[exclusionKey], id);
        accum[id] = isIncluded;
        return accum;
      }, {});
    }

    function createRanges(scales, includedDataSources) {
      return _(scales)
        .map(function(scale, dataSourceId) {
          return [dataSourceId, {
            pvf: {
              range: [scale.from, scale.to]
            }
          }];
        })
        .filter(function(scale) {
          return _.includes(_.keys(_.pickBy(includedDataSources)), scale[0]);
        })
        .fromPairs()
        .value();
    }

    function areValuesMissingInEffectsTable(subProblemState, scales, performanceTable) {
      var includedDataSourcesIds = _.keys(_.pickBy(subProblemState.dataSourceInclusions));
      var includedAlternatives = _.keys(_.pickBy(subProblemState.alternativeInclusions));
      return _.some(includedDataSourcesIds, function(dataSourceId) {
        return _.some(includedAlternatives, function(alternativeId) {
          return isNullNaNorUndefined(scales[dataSourceId][alternativeId]['50%']) &&
            missesEffectValue(performanceTable, dataSourceId, alternativeId);
        });
      });
    }

    function getMissingValueWarnings(subProblemState, scales, performanceTable) {
      var warnings = [];
      var includedDataSourcesIds = _.keys(_.pickBy(subProblemState.dataSourceInclusions));
      var includedAlternatives = _.keys(_.pickBy(subProblemState.alternativeInclusions));

      if (_.some(includedDataSourcesIds, function(dataSourceId) {
        return _.some(includedAlternatives, function(alternativeId) {
          return !isNullNaNorUndefined(scales[dataSourceId][alternativeId]['50%']) &&
            missesEffectValue(performanceTable, dataSourceId, alternativeId);
        });
      })) {
        warnings.push('Some cell(s) are missing deterministic values. SMAA values will be used for these cell(s).');
      }

      if (_.some(includedDataSourcesIds, function(dataSourceId) {
        return _.some(includedAlternatives, function(alternativeId) {
          return isNullNaNorUndefined(scales[dataSourceId][alternativeId]['50%']) &&
            !missesEffectValue(performanceTable, dataSourceId, alternativeId);
        });
      })) {
        warnings.push('Some cell(s) are missing SMAA values. Deterministic values will be used for these cell(s).');
      }

      return warnings;
    }

    function missesEffectValue(performanceTable, dataSourceId, alternativeId) {
      return !_.some(performanceTable, function(entry) {
        return entry.dataSource === dataSourceId &&
          entry.alternative === alternativeId &&
          entry.performance.effect &&
          entry.performance.effect.type !== 'empty';
      });
    }

    function isNullNaNorUndefined(value) {
      return value === null || value === undefined || isNaN(value);
    }

    function hasInvalidSlider(scalesDataSources, choices, scalesState) {
      return _.find(scalesDataSources, _.partial(hasValueAtWrongLocationOnSlider, choices, scalesState));
    }

    function hasValueAtWrongLocationOnSlider(choices, scalesState, dataSource) {
      var from = choices[dataSource].from;
      var to = choices[dataSource].to;
      var restrictedFrom = scalesState[dataSource].sliderOptions.restrictedRange.from;
      var restrictedTo = scalesState[dataSource].sliderOptions.restrictedRange.to;
      return (from === to || from > restrictedFrom || to < restrictedTo);
    }

    function getNumberOfDataSourcesPerCriterion(criteria, dataSourceInclusions) {
      return _.mapValues(criteria, function(criterion) {
        return _.filter(criterion.dataSources, function(dataSource) {
          return dataSourceInclusions[dataSource.id];
        }).length;
      });
    }

    function areTooManyDataSourcesSelected(numberOfDataSourcesPerCriterion) {
      return _.find(numberOfDataSourcesPerCriterion, function(n) {
        return n > 1;
      });
    }

    function getCriteriaByDataSource(criteria) {
      return _(criteria)
        .map(function(criterion) {
          return _.map(criterion.dataSources, function(dataSource) {
            return [dataSource.id, criterion.id];
          });
        })
        .flatten()
        .fromPairs()
        .value();
    }

    function createSubProblemState(problem, subProblem, criteria) {
      return {
        criterionInclusions: createCriterionInclusions(problem, subProblem),
        alternativeInclusions: createAlternativeInclusions(problem, subProblem),
        dataSourceInclusions: createDataSourceInclusions(problem, subProblem),
        ranges: _.merge({}, _.keyBy(criteria, 'id'), subProblem.definition.ranges)
      };
    }

    function createCriterionInclusions(problem, subProblem) {
      return createInclusions(problem.criteria, subProblem.definition, 'excludedCriteria');
    }

    function createAlternativeInclusions(problem, subProblem) {
      return createInclusions(problem.alternatives, subProblem.definition, 'excludedAlternatives');
    }

    function createDataSourceInclusions(problem, subProblem) {
      return _.reduce(problem.criteria, function(accum, criterion) {
        return _.extend({}, accum, createInclusions(_.keyBy(criterion.dataSources, 'id'),
          subProblem.definition, 'excludedDataSources'));
      }, {});
    }

    function excludeDeselectedAlternatives(performanceTable, alternativeInclusions) {
      return _.filter(performanceTable, function(entry) {
        return alternativeInclusions[entry.alternative];
      });
    }

    return {
      createSubProblemCommand: createSubProblemCommand,
      determineBaseline: determineBaseline,
      checkScaleRanges: checkScaleRanges,
      excludeDataSourcesForExcludedCriteria: excludeDataSourcesForExcludedCriteria,
      areValuesMissingInEffectsTable: areValuesMissingInEffectsTable,
      getMissingValueWarnings: getMissingValueWarnings,
      hasInvalidSlider: hasInvalidSlider,
      getNumberOfDataSourcesPerCriterion: getNumberOfDataSourcesPerCriterion,
      areTooManyDataSourcesSelected: areTooManyDataSourcesSelected,
      getCriteriaByDataSource: getCriteriaByDataSource,
      createSubProblemState: createSubProblemState,
      excludeDeselectedAlternatives: excludeDeselectedAlternatives
    };
  };


  return dependencies.concat(SubProblemService);
});
