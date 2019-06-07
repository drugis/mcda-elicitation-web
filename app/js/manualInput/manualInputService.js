'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'InputKnowledgeService',
    'generateUuid',
    'currentSchemaVersion'
  ];
  var ManualInputService = function(
    InputKnowledgeService,
    generateUuid,
    currentSchemaVersion
  ) {
    var INVALID_INPUT_MESSAGE = 'Missing or invalid input';

    function getInputError(cell) {
      if (cell.empty) {
        return;
      }
      var error;
      var inputParameters = _.pick(cell.inputParameters, ['firstParameter', 'secondParameter', 'thirdParameter']);
      _.find(inputParameters, function(inputParameter, key) {
        if (hasNotEstimableBound(cell, inputParameter)) {
          return;
        }
        var inputValue = cell[key];
        return _.find(inputParameter.constraints, function(constraint) {
          error = constraint.validator(inputValue, inputParameter.label, cell);
          return error;
        });
      });
      return error;
    }

    function hasNotEstimableBound(cell, parameter) {
      return (parameter.label === 'Lower bound' && cell.lowerBoundNE) ||
        (parameter.label === 'Upper bound' && cell.upperBoundNE);
    }

    function inputToString(cell) {
      if (getInputError(cell)) {
        return INVALID_INPUT_MESSAGE;
      }
      return cell.inputParameters.toString(cell);
    }

    function getOptions(inputType) {
      return InputKnowledgeService.getOptions(inputType);
    }

    function createProblem(criteria, alternatives, title, description, inputData) {
      var newCriteria = buildCriteria(criteria);
      return {
        schemaVersion: currentSchemaVersion,
        title: title,
        description: description,
        criteria: newCriteria,
        alternatives: buildAlternatives(alternatives),
        performanceTable: buildPerformanceTable(inputData, newCriteria, alternatives)
      };
    }

    function prepareInputData(criteria, alternatives, oldInputData) {
      var dataSources = getDataSources(criteria);
      if (oldInputData) {
        return {
          effect: createInputTableRows(dataSources, alternatives, oldInputData.effect),
          distribution: createInputTableRows(dataSources, alternatives, oldInputData.distribution)
        };
      } else {
        return {
          effect: createInputTableRows(dataSources, alternatives),
          distribution: createInputTableRows(dataSources, alternatives)
        };
      }
    }

    function createInputTableRows(dataSources, alternatives, oldInputData) {
      return _.reduce(dataSources, function(accum, dataSource) {
        accum[dataSource.id] = createInputTableCells(dataSource, alternatives, oldInputData);
        return accum;
      }, {});
    }

    function createInputTableCells(dataSource, alternatives, oldInputData) {
      return _.reduce(alternatives, function(accum, alternative) {
        if (hasOldInputDataAvailable(oldInputData, dataSource.id, alternative.id)) {
          accum[alternative.id] = oldInputData[dataSource.id][alternative.id];
        } else {
          accum[alternative.id] = {};
        }
        accum[alternative.id].isInvalid = true;
        return accum;
      }, {});
    }

    function hasOldInputDataAvailable(oldData, dataSourceId, alternativeId) {
      return oldData && oldData[dataSourceId] && oldData[dataSourceId][alternativeId];
    }

    function getDataSources(criteria) {
      return _.reduce(criteria, function(accum, criterion) {
        return accum.concat(criterion.dataSources);
      }, []);
    }

    function createStateFromOldWorkspace(oldWorkspace) {
      var state = {
        oldWorkspace: oldWorkspace,
        useFavorability: hasFavorableCriterion(oldWorkspace),
        step: 'step1',
        isInputDataValid: false,
        description: oldWorkspace.problem.description,
        criteria: copyOldWorkspaceCriteria(oldWorkspace),
        alternatives: copyOldWorkspaceAlternatives(oldWorkspace)
      };
      state.inputData = createInputFromOldWorkspace(state.criteria,
        state.alternatives, oldWorkspace);
      return state;
    }

    function hasFavorableCriterion(workspace) {
      return _.some(workspace.problem.criteria, function(criterion) {
        return criterion.hasOwnProperty('isFavorable');
      });
    }

    function copyOldWorkspaceAlternatives(oldWorkspace) {
      return _.map(oldWorkspace.problem.alternatives, function(alternative, alternativeId) {
        return _.extend({}, alternative, {
          id: generateUuid(),
          oldId: alternativeId
        });
      });
    }

    function buildCriteria(criteria) {
      var newCriteria = _.map(criteria, function(criterion) {
        var newCriterion = _.pick(criterion, [
          'title',
          'description',
          'unitOfMeasurement',
          'isFavorable'
        ]);
        newCriterion.dataSources = _.map(criterion.dataSources, buildDataSource);
        return [criterion.id, newCriterion];
      });
      return _.fromPairs(newCriteria);
    }

    function buildDataSource(dataSource) {
      var newDataSource = addScale(dataSource);
      delete newDataSource.oldId;
      return newDataSource;
    }

    function addScale(dataSource) {
      var newDataSource = _.cloneDeep(dataSource);
      newDataSource.scale = [-Infinity, Infinity];
      return newDataSource;
    }

    function buildAlternatives(alternatives) {
      return _(alternatives).keyBy('id').mapValues(function(alternative) {
        return _.pick(alternative, ['title']);
      }).value();
    }

    function buildPerformanceTable(inputData, criteria, alternatives) {
      return _(criteria)
        .map(_.partial(buildEntriesForCriterion, inputData, alternatives))
        .flatten()
        .flatten()
        .value();
    }

    function buildEntriesForCriterion(inputData, alternatives, criterion, criterionId) {
      return _.map(criterion.dataSources, function(dataSource) {
        return buildPerformanceEntries(inputData, criterionId, dataSource.id, alternatives);
      });
    }

    function buildPerformanceEntries(inputData, criterionId, dataSourceId, alternatives) {
      return _.map(alternatives, function(alternative) {
        var effectCell = inputData.effect[dataSourceId][alternative.id];
        var distributionCell = inputData.distribution[dataSourceId][alternative.id];
        return {
          alternative: alternative.id,
          criterion: criterionId,
          dataSource: dataSourceId,
          performance: buildPerformance(effectCell, distributionCell)
        };
      });
    }

    function buildPerformance(effectCell, distributionCell) {
      return {
        effect: effectCell.inputParameters.buildPerformance(effectCell),
        distribution: distributionCell.inputParameters.buildPerformance(distributionCell)
      };
    }

    function copyOldWorkspaceCriteria(workspace) {
      return _.map(workspace.problem.criteria, function(criterion) {
        var newCrit = _.pick(criterion, ['title', 'description', 'isFavorable']); // omit scales, preferences
        if (canBePercentage(criterion) && criterion.unitOfMeasurement) {
          newCrit.unitOfMeasurement = criterion.unitOfMeasurement;
        }
        newCrit.dataSources = copyOldWorkspaceDataSource(criterion);
        newCrit.id = generateUuid();
        return newCrit;
      });
    }

    function canBePercentage(criterion) {
      return !_.some(criterion.dataSources, function(dataSource) {
        return _.isEqual([0, 1], dataSource.scale);
      });
    }

    function copyOldWorkspaceDataSource(criterion) {
      return _.map(criterion.dataSources, function(dataSource) {
        var newDataSource = _.pick(dataSource, [
          'source',
          'sourceLink',
          'strengthOfEvidence',
          'uncertainties'
        ]);
        newDataSource.id = generateUuid();
        newDataSource.oldId = dataSource.id;
        return newDataSource;
      });
    }

    function createInputFromOldWorkspace(criteria, alternatives, oldWorkspace) {
      return _.reduce(oldWorkspace.problem.performanceTable, function(accum, tableEntry) {
        var dataSources = getDataSources(criteria);
        var dataSourceForEntry = _.find(dataSources, ['oldId', tableEntry.dataSource]);
        var alternative = _.find(alternatives, ['oldId', tableEntry.alternative]);
        if (dataSourceForEntry && alternative) {
          if (!accum[dataSourceForEntry.id]) {
            accum[dataSourceForEntry.id] = {};
          }
          accum[dataSourceForEntry.id][alternative.id] = createInputCell(dataSourceForEntry, tableEntry);
        }
        return accum;
      }, {});
    }

    function createInputCell(dataSource, tableEntry) {
      return InputKnowledgeService.finishInputCell(dataSource, tableEntry);
    }

    function findInvalidRow(inputData) {
      return _.some(inputData, function(row) {
        if (findCellThatIsDifferent(row)) {
          return;
        }
        return row;
      });
    }

    function findCellThatIsDifferent(row) {
      return _.some(row, function(cell) {
        return _.some(row, function(otherCell) {
          return compareCells(cell, otherCell);
        });
      });
    }

    function compareCells(cell, otherCell) {
      if (cell.inputParameters && cell.inputParameters.id === 'eventsSampleSize') {
        if (otherCell.inputParameters.id === 'eventsSampleSize') {
          return cell.firstParameter !== otherCell.firstParameter || cell.secondParameter !== otherCell.secondParameter;
        } else {
          return cell.firstParameter / cell.secondParameter !== otherCell.firstParameter;
        }
      }
      return cell.firstParameter !== otherCell.firstParameter;
    }

    function findInvalidCell(inputData) {
      return _.some(inputData, function(row) {
        return _.some(row, 'isInvalid');
      });
    }

    function generateDistributions(inputData) {
      return _.mapValues(inputData.effect, _.partial(generateDistributionsForCriterion, inputData));
    }

    function generateDistributionsForCriterion(inputData, row, dataSource) {
      return _.mapValues(row, _.partial(generateDistributionForCell, inputData, dataSource));
    }

    function generateDistributionForCell(inputData, dataSource, cell, alternative) {
      if (cell.isInvalid) {
        return inputData.distribution[dataSource][alternative];
      }
      return cell.inputParameters.generateDistribution(cell);
    }

    return {
      createProblem: createProblem,
      inputToString: inputToString,
      getInputError: getInputError,
      prepareInputData: prepareInputData,
      getOptions: getOptions,
      createStateFromOldWorkspace: createStateFromOldWorkspace,
      findInvalidRow: findInvalidRow,
      findInvalidCell: findInvalidCell,
      generateDistributions: generateDistributions
    };
  };

  return dependencies.concat(ManualInputService);
});
