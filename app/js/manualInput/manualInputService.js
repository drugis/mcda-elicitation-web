'use strict';
define(['lodash', 'angular'], function(_) {
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

    // Exposed functions
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
          error = constraint(inputValue, inputParameter.label, cell);
          return error;
        });
      });
      return error;
    }

    function hasNotEstimableBound(cell, parameter) {
      return (parameter.label === 'Lower bound' && cell.lowerBoundNE) || (parameter.label === 'Upper bound' && cell.upperBoundNE)
    }

    function inputToString(cell) {
      if (getInputError(cell)) {
        return INVALID_INPUT_MESSAGE;
      }
      return InputKnowledgeService.inputToString(cell);
    }

    function getOptions(cell) {
      return InputKnowledgeService.getOptions(cell);
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
      return createInputTableRows(dataSources, alternatives, oldInputData);
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
          accum[alternative.id] = _.pick(dataSource, ['inputType', 'inputMethod', 'dataType', 'parameterOfInterest']);
        }
        accum[alternative.id].isInvalid = true;
        return accum;
      }, {});
    }

    function hasOldInputDataAvailable(oldData, dataSourceId, alternativeId) {
      return oldData && oldData[dataSourceId] && oldData[dataSourceId][alternativeId]
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
      return !!_.find(workspace.problem.criteria, function(criterion) {
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
      if (dataSource.dataType === 'dichotomous' ||
        (dataSource.dataType === 'continuous' && dataSource.parameterOfInterest === 'cumulativeProbability')) {
        newDataSource.scale = [0, 1];
      }
      return newDataSource;
    }

    function buildAlternatives(alternatives) {
      return _(alternatives).keyBy('id').mapValues((alternative) => {
        return _.pick(alternative, ['title']);
      }).value();
    }

    function buildPerformanceTable(inputData, criteria, alternatives) {
      return _(criteria).map((criterion, criterionId) => {
        return _.map(criterion.dataSources, (dataSource) => {
          return buildPerformanceEntries(inputData, criterionId, dataSource.id, alternatives);
        });
      })
        .flatten()
        .flatten()
        .value();
    }

    function buildPerformanceEntries(inputData, criterionId, dataSourceId, alternatives) {
      return _.map(alternatives, (alternative) => {
        var cell = inputData[dataSourceId][alternative.id];
        return {
          alternative: alternative.id,
          criterion: criterionId,
          dataSource: dataSourceId,
          performance: InputKnowledgeService.buildPerformance(cell)
        };
      });
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
          'uncertainties',
          'inputType',
          'inputMethod',
          'dataType',
          'parameterOfInterest'
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
      return _.find(inputData, function(row) {
        if (findDistributionCell(row) || findNormalDistributedCell(row) || findCellThatIsDifferent(row)) {
          return;
        }
        return row;
      });
    }

    function findCellThatIsDifferent(row) {
      return _.find(row, function(cell) {
        return _.find(row, function(otherCell) {
          return compareCells(cell, otherCell);
        });
      });
    }

    function compareCells(cell, otherCell) {
      if (cell.inputParameters && cell.inputParameters.id === 'dichotomousFraction') {
        if (otherCell.inputParameters.id === 'dichotomousFraction') {
          return cell.firstParameter !== otherCell.firstParameter || cell.secondParameter !== otherCell.secondParameter;
        } else {
          return cell.firstParameter / cell.secondParameter !== otherCell.firstParameter;
        }
      }
      return cell.firstParameter !== otherCell.firstParameter;
    }

    function findDistributionCell(row) {
      return _.find(row, function(cell) {
        return cell.inputType !== 'effect';
      });
    }

    function findNormalDistributedCell(row) {
      return _.find(row, function(cell) {
        return cell.isNormal;
      });
    }

    function findInvalidCell(inputData) {
      return _.find(inputData, function(row) {
        return _.find(row, 'isInvalid');
      });
    }

    return {
      createProblem: createProblem,
      inputToString: inputToString,
      getInputError: getInputError,
      prepareInputData: prepareInputData,
      getOptions: getOptions,
      createStateFromOldWorkspace: createStateFromOldWorkspace,
      findInvalidRow: findInvalidRow,
      findInvalidCell: findInvalidCell
    };
  };

  return dependencies.concat(ManualInputService);
});
