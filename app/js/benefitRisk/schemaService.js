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
     * 1.0.0 introduction of data sources
     * 1.1.0 removal of the value tree
     * 1.2.0 allow effect cells to contain distribution and effect
     * *****/

    function updateProblemToCurrentSchema(problem) {
      var newProblem = angular.copy(problem);
      if (!problem.schemaVersion) {
        newProblem = updateToVersionOnePointZeroPointZero(newProblem);
      }

      if (newProblem.schemaVersion === '1.0.0') {
        newProblem = updateToVersionOnePointOnePointZero(newProblem);
      }

      if (newProblem.schemaVersion === '1.1.0') {
        newProblem = updateToVersionOnePointTwoPointZero(newProblem);
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
      newWorkspace.problem = updateProblemToCurrentSchema(newWorkspace.problem).content;
      return newWorkspace;
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
      loadSchema(ajv, 'relativeEffect.json');
      loadSchema(ajv, 'absoluteEffect.json');
      return ajv;
    }

    function loadSchema(ajv, schemaName) {
      var schema = require('schema-basePath/' + schemaName);
      ajv.addSchema(schema, schemaName);
    }

    function updateToVersionOnePointZeroPointZero(problem) {
      var newProblem = angular.copy(problem);
      newProblem.criteria = _.mapValues(problem.criteria, createNewCriterion);
      newProblem.performanceTable = createNewPerformanceTable(newProblem);
      newProblem.schemaVersion = '1.0.0';
      return newProblem;
    }

    function updateToVersionOnePointOnePointZero(problem) {
      var newProblem = angular.copy(problem);
      if (newProblem.valueTree) {
        newProblem.criteria = putFavorabilityOnCriteria(problem);
        delete newProblem.valueTree;
      }
      newProblem.schemaVersion = '1.1.0';
      return newProblem;
    }

    function updateToVersionOnePointTwoPointZero(problem) {
      var newProblem = angular.copy(problem);
      newProblem.performanceTable = changePerformanceTypeToArray(newProblem);
      newProblem.criteria = removeObsoletePropertiesFromDataSource(newProblem);
      newProblem.schemaVersion = '1.2.0';
      return newProblem;
    }

    function removeObsoletePropertiesFromDataSource(problem) {
      return _.mapValues(problem.criteria, function(criterion) {
        criterion.dataSources = _.map(criterion.dataSources, function(dataSource) {
          delete dataSource.inputType;
          delete dataSource.inputMethod;
          delete dataSource.dataType;
          delete dataSource.parameterOfInterest;
          return dataSource;
        });
        return criterion;
      });
    }

    function changePerformanceTypeToArray(problem) {
      return _.map(problem.performanceTable, function(entry) {
        if (entry.alternative) {
          entry.performance.type = [entry.performance.type];
          return entry;
        } else {
          return entry;
        }
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

    return {
      updateProblemToCurrentSchema: updateProblemToCurrentSchema,
      updateWorkspaceToCurrentSchema: updateWorkspaceToCurrentSchema
    };
  };

  return dependencies.concat(SchemaService);
});
