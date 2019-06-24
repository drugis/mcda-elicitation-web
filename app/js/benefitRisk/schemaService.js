'use strict';
define(['lodash', 'angular', 'ajv'], function(_, angular, Ajv) {

  var dependencies = [
    'currentSchemaVersion',
    'generateUuid'
  ];
  var SchemaService = function(
    currentSchemaVersion,
    generateUuid
  ) {
    /***** Changes 
     * 1.0.0 Introduction of data sources
     * 1.1.0 Removal of the value tree
     * 1.2.0 Allow effect cells to contain distribution and effect
     *       Remove properties from data sources
     *       Fix legacy problem: remove scales from criteria and put them on data source(s)
     * 1.2.1 Adding text option for effects table cells
     * 1.2.2 Splitting the performance table entry performances, and making them a bit more strict
     * 1.3.0 Move unit of measurement to data source
     * 1.3.1 Remove favorability property if it is not boolean
     * 1.3.2 Remove null/undefined properties from data sources
     * 1.3.3 Remove alternative property from alternatives
     * *****/

    function updateProblemToCurrentSchema(problem) {
      var newProblem = angular.copy(problem);
      if (!problem.schemaVersion) {
        newProblem = updateToVersion100(newProblem);
      }

      if (newProblem.schemaVersion === '1.0.0') {
        newProblem = updateToVersion110(newProblem);
      }

      if (newProblem.schemaVersion === '1.1.0') {
        newProblem = updateToVersion120(newProblem);
      }

      if (newProblem.schemaVersion === '1.2.0' || newProblem.schemaVersion === '1.2.1') {
        newProblem.schemaVersion = '1.2.2';
      }

      if (newProblem.schemaVersion === '1.2.2') {
        newProblem = updateToVersion130(newProblem);
      }

      if (newProblem.schemaVersion === '1.3.0') {
        newProblem = updateToVersion131(newProblem);
      }

      if (newProblem.schemaVersion === '1.3.1') {
        newProblem = updateToVersion132(newProblem);
      }

      if (newProblem.schemaVersion === '1.3.2') {
        newProblem = updateToVersion133(newProblem);
      }

      if (newProblem.schemaVersion === currentSchemaVersion) {
        var error = isInvalidSchema(newProblem);

        if (error) {
          return {
            isValid: false,
            errorMessage: error[0].dataPath + ' ' + error[0].message
          };
        } else {
          return {
            isValid: true,
            content: newProblem
          };
        }
      }
    }

    function updateWorkspaceToCurrentSchema(workspace) {
      var newWorkspace = angular.copy(workspace);
      var updatedProblem = updateProblemToCurrentSchema(newWorkspace.problem);
      if (updatedProblem.errorMessage) {
        throw (updatedProblem.errorMessage);
      } else {
        newWorkspace.problem = updatedProblem.content;
        return newWorkspace;
      }
    }

    function isInvalidSchema(uploadedJSON) {
      var ajv = loadSchemas();
      var isValid = ajv.validate('problem.json', uploadedJSON);
      if (!isValid) {
        return ajv.errors;
      }
    }

    function loadSchemas() {
      var ajv = new Ajv();
      loadSchema(ajv, 'problem.json');
      loadSchema(ajv, 'dataSource.json');
      loadSchema(ajv, 'relativeEntry.json');
      loadSchema(ajv, 'absoluteEntry.json');
      loadSchema(ajv, 'emptyPerformance.json');

      loadSchema(ajv, 'valueEffect.json');
      loadSchema(ajv, 'valueSEEffect.json');
      loadSchema(ajv, 'valueCIEffect.json');
      loadSchema(ajv, 'valueSampleSizeEffect.json');
      loadSchema(ajv, 'eventsSampleSizeEffect.json');

      loadSchema(ajv, 'normalDistribution.json');
      loadSchema(ajv, 'tDistribution.json');
      loadSchema(ajv, 'betaDistribution.json');
      loadSchema(ajv, 'gammaDistribution.json');
      loadSchema(ajv, 'survivalDistribution.json');
      return ajv;
    }

    function loadSchema(ajv, schemaName) {
      var schema = require('schema-basePath/' + schemaName);
      ajv.addSchema(schema, schemaName);
    }

    function updateToVersion100(problem) {
      var newProblem = angular.copy(problem);
      newProblem.criteria = _.mapValues(problem.criteria, createNewCriterion);
      newProblem.performanceTable = createNewPerformanceTable(newProblem);
      newProblem.schemaVersion = '1.0.0';
      return newProblem;
    }

    function updateToVersion110(problem) {
      var newProblem = angular.copy(problem);
      if (newProblem.valueTree) {
        newProblem.criteria = putFavorabilityOnCriteria(problem);
        delete newProblem.valueTree;
      }
      newProblem.schemaVersion = '1.1.0';
      return newProblem;
    }

    function updateToVersion120(problem) {
      var newProblem = angular.copy(problem);
      newProblem.criteria = moveCriterionScaleToDataSource(newProblem);
      newProblem.criteria = removeObsoletePropertiesFromDataSource(newProblem);
      newProblem.performanceTable = movePerfomancesToDistribution(newProblem);
      newProblem.schemaVersion = '1.2.0';
      return newProblem;
    }

    function movePerfomancesToDistribution(problem) {
      return _.map(problem.performanceTable, function(entry) {
        var newEntry = angular.copy(entry);
        newEntry.performance = {
          distribution: newEntry.performance
        };
        return newEntry;
      });
    }

    function moveCriterionScaleToDataSource(problem) {
      return _.mapValues(problem.criteria, function(criterion) {
        criterion.dataSources = _.map(criterion.dataSources, function(dataSource) {
          if (!dataSource.scale && criterion.scale) {
            dataSource.scale = criterion.scale;
          }
          return dataSource;
        });
        delete criterion.scale;
        return criterion;
      });
    }

    function removeObsoletePropertiesFromDataSource(problem) {
      return _.mapValues(problem.criteria, function(criterion) {
        criterion.dataSources = _.map(criterion.dataSources, function(dataSource) {
          delete dataSource.inputType;
          delete dataSource.inputMethod;
          delete dataSource.dataType;
          delete dataSource.parameterOfInterest;
          delete dataSource.oldId;
          return dataSource;
        });
        return criterion;
      });
    }

    function putFavorabilityOnCriteria(problem) {
      return _.mapValues(problem.criteria, function(criterion, criterionId) {
        var newCriterion = angular.copy(criterion);
        if (problem.valueTree.children[0].criteria) {
          newCriterion.isFavorable = _.includes(problem.valueTree.children[0].criteria, criterionId);
        } else {
          newCriterion.isFavorable = _.includes(_.flatten(_.map(problem.valueTree.children[0].children, 'criteria')));
        }
        return newCriterion;
      });
    }

    function createNewPerformanceTable(problem) {
      return _.map(problem.performanceTable, function(tableEntry) {
        var newEntry = angular.copy(tableEntry);
        if (tableEntry.criterionUri) {
          newEntry.criterion = tableEntry.criterionUri;
          delete newEntry.criterionUri;
        }
        newEntry.dataSource = problem.criteria[newEntry.criterion].dataSources[0].id;
        return newEntry;
      });
    }

    function createNewCriterion(criterion) {
      var newCriterion = _.pick(criterion, [
        'title',
        'description',
        'unitOfMeasurement'
      ]);
      var dataSource = createDataSource(criterion);
      newCriterion.dataSources = [dataSource];
      return newCriterion;
    }

    function createDataSource(criterion) {
      var dataSource = _.pick(criterion, [
        'pvf',
        'source',
        'sourceLink',
        'strengthOfEvidence',
        'uncertainties',
        'scale'
      ]);
      dataSource.id = generateUuid();
      return dataSource;
    }

    function updateToVersion130(problem) {
      var newProblem = angular.copy(problem);
      newProblem.criteria = _.mapValues(problem.criteria, function(criterion) {
        var newCriterion = angular.copy(criterion);
        newCriterion.dataSources = _.map(criterion.dataSources, function(dataSource) {
          var newDataSource = angular.copy(dataSource);
          if (criterion.unitOfMeasurement !== undefined) {
            newDataSource.unitOfMeasurement = criterion.unitOfMeasurement;
          }
          return newDataSource;
        });
        delete newCriterion.unitOfMeasurement;
        return newCriterion;
      });
      newProblem.schemaVersion = '1.3.0';
      return newProblem;
    }

    function updateToVersion131(problem) {
      var newProblem = angular.copy(problem);
      newProblem.criteria = _.mapValues(problem.criteria, function(criterion) {
        var newCriterion = angular.copy(criterion);
        if (criterion.isFavorable === undefined || criterion.isFavorable === null) {
          delete newCriterion.isFavorable;
        }
        return newCriterion;
      });
      newProblem.schemaVersion = '1.3.1';
      return newProblem;
    }

    function updateToVersion132(problem) {
      var newProblem = angular.copy(problem);
      newProblem.criteria = _.mapValues(problem.criteria, function(criterion) {
        var newCriterion = angular.copy(criterion);
        newCriterion.dataSources = _.map(criterion.dataSources, function(dataSource) {
          var properties = _.keys(dataSource);
          var newDataSource = _.reduce(properties, function(accum, property) {
            if (dataSource[property]) {
              accum[property] = dataSource[property];
            }
            return accum;
          }, {});
          return newDataSource;
        });
        return newCriterion;
      });
      newProblem.schemaVersion = '1.3.2';
      return newProblem;
    }

    function updateToVersion133(problem) {
      var newProblem = angular.copy(problem); 
      newProblem.alternatives = _.mapValues(problem.alternatives, function(alternative){
        return _.pick(alternative, ['title']);
      });
      newProblem.schemaVersion = '1.3.3';
       return newProblem;
    }

    return {
      updateProblemToCurrentSchema: updateProblemToCurrentSchema,
      updateWorkspaceToCurrentSchema: updateWorkspaceToCurrentSchema
    };
  };

  return dependencies.concat(SchemaService);
});
