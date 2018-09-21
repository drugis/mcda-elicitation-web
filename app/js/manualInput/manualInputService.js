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
      var error;
      if (cell.empty) {
        return;
      }
      var inputParameters = _.pick(cell.inputParameters, ['firstParameter', 'secondParameter', 'thirdParameter']);
      _.find(inputParameters, function(inputParameter, key) {
        var inputValue = cell[key];
        if ((inputParameter.label === 'Lower bound' && cell.lowerBoundNE) || (inputParameter.label === 'Upper bound' && cell.upperBoundNE)) {
          return;
        }
        return _.find(inputParameter.constraints, function(constraint) {
          error = constraint(inputValue, inputParameter.label, cell);
          return error;
        });
      });
      return error;
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

    function createProblem(criteria, treatments, title, description, inputData) {
      var newCriteria = buildCriteria(criteria);
      return {
        schemaVersion: currentSchemaVersion,
        title: title,
        description: description,
        criteria: newCriteria,
        alternatives: buildAlternatives(treatments),
        performanceTable: buildPerformanceTable(inputData, newCriteria, treatments)
      };
    }

    function prepareInputData(criteria, alternatives, oldInputData) {
      var dataSources = _.reduce(criteria, function(accum, criterion) {
        return accum.concat(criterion.dataSources);
      }, []);
      return _.reduce(dataSources, function(accum, dataSource) {
        accum[dataSource.id] = _.reduce(alternatives, function(accum, alternative) {
          if (oldInputData && oldInputData[dataSource.id] && oldInputData[dataSource.id][alternative.id]) {
            accum[alternative.id] = oldInputData[dataSource.id][alternative.id];
            accum[alternative.id].isInvalid = true;
          } else {
            accum[alternative.id] = _.pick(dataSource, ['inputType', 'inputMethod', 'dataType', 'parameterOfInterest']);
            accum[alternative.id].isInvalid = true;
          }
          return accum;
        }, {});
        return accum;
      }, {});
    }

    function createStateFromOldWorkspace(oldWorkspace) {
      var state = {
        oldWorkspace: oldWorkspace,
        useFavorability: !!_.find(oldWorkspace.problem.criteria, function(criterion) {
          return criterion.hasOwnProperty('isFavorable');
        }),
        step: 'step1',
        isInputDataValid: false,
        description: oldWorkspace.problem.description,
        criteria: copyOldWorkspaceCriteria(oldWorkspace),
        alternatives: _.map(oldWorkspace.problem.alternatives, function(alternative, alternativeId) {
          return _.extend({}, alternative, {
            id: generateUuid(),
            oldId: alternativeId
          });
        })
      };
      state.inputData = createInputFromOldWorkspace(state.criteria,
        state.alternatives, oldWorkspace);
      return state;
    }
    
    // Private functions
    function buildCriteria(criteria) {
      var newCriteria = _.map(criteria, function(criterion) {
        var newCriterion = _.pick(criterion, [
          'title',
          'description',
          'unitOfMeasurement',
          'isFavorable'
        ]);
        newCriterion.dataSources = _.map(criterion.dataSources, addScale);
        return [criterion.id, newCriterion];
      });
      return _.fromPairs(newCriteria);
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
      return _.reduce(alternatives, function(accum, alternative) {
        accum[alternative.id] = {
          title: alternative.title
        };
        return accum;
      }, {});
    }

    function buildPerformanceTable(inputData, criteria, treatments) {
      var newPerformanceTable = [];
      _.forEach(criteria, function(criterion, criterionId) {
        _.forEach(criterion.dataSources, function(dataSource) {
          _.forEach(treatments, function(treatment) {
            var cell = inputData[dataSource.id][treatment.id];
            newPerformanceTable.push({
              alternative: treatment.id,
              criterion: criterionId,
              dataSource: dataSource.id,
              performance: InputKnowledgeService.buildPerformance(cell)
            });
          });
        });
      });
      return newPerformanceTable;
    }

    function copyOldWorkspaceCriteria(workspace) {
      return _.map(workspace.problem.criteria, function(criterion) {
        var newCrit = _.pick(criterion, ['title', 'description', 'unitOfMeasurement', 'isFavorable']); // omit scales, preferences
        newCrit.dataSources = _.map(criterion.dataSources, function(dataSource) {
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
        newCrit.id = generateUuid();
        return newCrit;
      });
    }

    function createInputFromOldWorkspace(criteria, alternatives, oldWorkspace) {
      return _.reduce(oldWorkspace.problem.performanceTable, function(accum, tableEntry) {
        var dataSourceForEntry;
        _.forEach(criteria, function(criterion) {
          _.forEach(criterion.dataSources, function(dataSource) {
            if (dataSource.oldId === tableEntry.dataSource) {
              dataSourceForEntry = dataSource;
            }
          });
        });
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

    return {
      createProblem: createProblem,
      inputToString: inputToString,
      getInputError: getInputError,
      prepareInputData: prepareInputData,
      getOptions: getOptions,
      createStateFromOldWorkspace: createStateFromOldWorkspace
    };
  };

  return dependencies.concat(ManualInputService);
});
