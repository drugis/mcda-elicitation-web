'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = ['InputKnowledgeService', 'generateUuid'];
  var ManualInputService = function(InputKnowledgeService, generateUuid) {
    var INVALID_INPUT_MESSAGE = 'Missing or invalid input';
    var SCHEMA_VERSION = '1.0.0';

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

    function createProblem(criteria, treatments, title, description, inputData, useFavorability) {
      var newCriteria = buildCriteria(criteria);
      var problem = {
        schemaVersion: SCHEMA_VERSION,
        title: title,
        description: description,
        criteria: newCriteria,
        alternatives: buildAlternatives(treatments),
        performanceTable: buildPerformanceTable(inputData, newCriteria, treatments)
      };
      if (useFavorability) {
        problem.valueTree = {
          title: 'Benefit-risk balance',
          children: [{
            title: 'Favourable effects',
            criteria: _.keys(_.pickBy(newCriteria, function(newCrit) {
              var matched = _.find(criteria, ['title', newCrit.title]);
              return matched.isFavorable;
            }))
          }, {
            title: 'Unfavourable effects',
            criteria: _.keys(_.omitBy(newCriteria, function(newCrit) {
              var matched = _.find(criteria, ['title', newCrit.title]);
              return matched.isFavorable;
            }))
          }]
        };
      }
      return problem;
    }

    function prepareInputData(criteria, alternatives, oldInputData) {
      return _.reduce(criteria, function(accum, criterion) {
        accum[criterion.id] = _.reduce(alternatives, function(accum, alternative) {
          if (oldInputData && oldInputData[criterion.id] && oldInputData[criterion.id][alternative.id]) {
            accum[alternative.id] = oldInputData[criterion.id][alternative.id];
            accum[alternative.id].isInvalid = true;
          } else {
            accum[alternative.id] = _.cloneDeep(criterion.inputMetaData);
            accum[alternative.id].isInvalid = true;
          }
          return accum;
        }, {});
        return accum;
      }, {});
    }

    function buildScale(criterion) {
      if (criterion.inputMetaData.dataType === 'dichotomous' ||
        (criterion.inputMetaData.dataType === 'continuous' && criterion.inputMetaData.parameterOfInterest === 'cumulativeProbability')) {
        return [0, 1];
      }
      return [-Infinity, Infinity];
    }

    function createInputFromOldWorkspace(criteria, alternatives, oldWorkspace) {
      return _.reduce(oldWorkspace.problem.performanceTable, function(accum, tableEntry) {
        var criterion = _.find(criteria, ['oldId', tableEntry.criterion]);
        var alternative = _.find(alternatives, ['oldId', tableEntry.alternative]);
        if (criterion && alternative && criterion.inputMetaData.inputType !== 'Unknown') {
          if (!accum[criterion.id]) {
            accum[criterion.id] = {};
          }
          accum[criterion.id][alternative.id] = createInputCell(criterion, tableEntry);
        }
        return accum;
      }, {});
    }

    function createInputCell(criterion, tableEntry) {
      return InputKnowledgeService.finishInputCell(criterion.inputMetaData, tableEntry);
    }

    function copyWorkspaceCriteria(workspace) {
      var copyFunctions = {
        'unknown': copySchemaZeroCriteria,
        '1.0.0': copySchemaOneCriteria
      };
      var schemaVersion = workspace.problem.schemaVersion ? workspace.problem.schemaVersion : 'unknown';
      return copyFunctions[schemaVersion](workspace);
    }

    function buildCriteriaRows(criteria) {
      return _.reduce(criteria, function(accum, criterion) {
        accum = accum.concat(_.map(criterion.dataSources, function(dataSource, index) {
          return {
            criterion: _.merge({}, _.omit(criterion, ['dataSources']), {
              isFirstRow: index === 0,
              numberOfDataSources: criterion.dataSources.length
            }),
            dataSource: dataSource
          };
        }));
        return accum;
      }, []);
    }

    // Private functions
    function copySchemaZeroCriteria(workspace) {
      return _.map(workspace.problem.criteria, function(criterion, criterionId) {
        var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink', 'unitOfMeasurement',
          'strengthOfEvidence', 'uncertainties']); // omit scales, preferences
        newCrit.id = generateUuid();
        newCrit.oldId = criterionId;
        if (workspace.problem.valueTree) {
          newCrit.isFavorable = _.includes(workspace.problem.valueTree.children[0].criteria, criterionId) ? true : false;
        }
        var tableEntry = _.find(workspace.problem.performanceTable, ['criterion', criterionId]);
        var MANUAL_DISTRIBUTIONS = ['exact', 'dnorm', 'dbeta', 'dgamma'];
        var performanceType = tableEntry.performance.type;
        if (_.includes(MANUAL_DISTRIBUTIONS, performanceType)) {
          newCrit.inputMetaData = {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          };
        } else if (performanceType === 'dt') {
          newCrit.inputMetaData = {
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            dataType: 'continuous'
          };
        } else {
          newCrit.inputMetaData = {
            inputType: 'Unknown'
          };
        }
        return newCrit;
      });
    }

    function copySchemaOneCriteria(workspace) {
      return _.map(workspace.problem.criteria, function(criterion, criterionId) {
        var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink', 'unitOfMeasurement',
          'strengthOfEvidence', 'uncertainties', 'inputMetaData']); // omit scales, preferences
        newCrit.id = generateUuid();
        newCrit.oldId = criterionId;
        if (workspace.problem.valueTree) {
          newCrit.isFavorable = _.includes(workspace.problem.valueTree.children[0].criteria, criterionId) ? true : false;
        }
        return newCrit;
      });
    }

    function buildCriteria(criteria) {
      var newCriteria = _.map(criteria, function(criterion) {
        var newCriterion = _.pick(criterion, ['title',
          'description',
          'unitOfMeasurement',
          'source',
          'sourceLink',
          'strengthOfEvidence',
          'uncertainties',
          'inputMetaData']);
        newCriterion.scale = buildScale(criterion);
        return [criterion.id, newCriterion];
      });
      return _.fromPairs(newCriteria);
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
      _.forEach(_.keys(criteria), function(criterionId) {
        _.forEach(treatments, function(treatment) {
          var cell = inputData[criterionId][treatment.id];
          newPerformanceTable.push({
            alternative: treatment.id,
            criterion: criterionId,
            performance: InputKnowledgeService.buildPerformance(cell)
          });
        });
      });
      return newPerformanceTable;
    }


    return {
      createProblem: createProblem,
      inputToString: inputToString,
      getInputError: getInputError,
      prepareInputData: prepareInputData,
      createInputFromOldWorkspace: createInputFromOldWorkspace,
      copyWorkspaceCriteria: copyWorkspaceCriteria,
      getOptions: getOptions,
      buildCriteriaRows: buildCriteriaRows
    };
  };

  return dependencies.concat(ManualInputService);
});
