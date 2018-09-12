'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    'generateUuid',
    'currentSchemaVersion'
  ];
  var SchemaService = function(
    generateUuid,
    currentSchemaVersion
  ) {
    /***** Changes 
     * 1.0.0 introduction of data sources
     * 1.1.0 removal of the value tree
     * *****/

    function updateProblemToCurrentSchema(problem) {
      var newProblem = angular.copy(problem);
      if (!problem.schemaVersion) {
        newProblem = updateToVersionOnePointZeroPointZero(newProblem);
      }

      if (newProblem.schemaVersion === '1.0.0') {
        newProblem = updateToVersionOnePointOnePointZero(newProblem);
      }

      if (newProblem.schemaVersion === currentSchemaVersion) {
        return newProblem;
      }
    }

    function updateWorkspaceToCurrentSchema(workspace) {
      var newWorkspace = angular.copy(workspace);
      newWorkspace.problem = updateProblemToCurrentSchema(newWorkspace.problem);
      return newWorkspace;
    }

    //private 
    function updateToVersionOnePointZeroPointZero(problem) {
      var newProblem = angular.copy(problem);
      newProblem.criteria = _.mapValues(problem.criteria, function(criterion, criterionId) {
        return createNewCriterion(problem, criterion, criterionId);
      });
      newProblem.performanceTable = createNewPerformanceTable(newProblem);
      newProblem.schemaVersion = '1.0.0';
      return newProblem;
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

    function createNewCriterion(problem, criterion, criterionId) {
      var newCriterion = _.pick(criterion, ['title', 'description', 'unitOfMeasurement', 'scale']);
      var dataSource = createDataSource(problem, criterion, criterionId);
      newCriterion.dataSources = [dataSource];
      return newCriterion;
    }

    function createDataSource(problem, criterion, criterionId) {
      var dataSource = _.pick(criterion, ['pvf', 'source', 'sourceLink', 'strengthOfEvidence', 'uncertainties']);
      dataSource.id = generateUuid();

      var tableEntry = findEntryForCriterion(problem.performanceTable, criterionId);

      if (isManualDistribution(tableEntry.performance.type)) {
        dataSource.inputType = 'distribution';
        dataSource.inputMethod = 'manualDistribution';
      } else if (tableEntry.performance.type === 'dt') {
        dataSource.inputType = 'distribution';
        dataSource.inputMethod = 'assistedDistribution';
        dataSource.dataType = 'continuous';
      }
      return dataSource;
    }

    function findEntryForCriterion(performanceTable, criterionId) {
      var tableEntry = _.find(performanceTable, ['criterion', criterionId]);
      if (!tableEntry) {
        tableEntry = _.find(performanceTable, ['criterionUri', criterionId]);
      }
      return tableEntry;
    }

    function isManualDistribution(type) {
      var MANUAL_DISTRIBUTIONS = ['exact', 'dnorm', 'dbeta', 'dgamma'];
      return _.includes(MANUAL_DISTRIBUTIONS, type);
    }

    function updateToVersionOnePointOnePointZero(problem) {
      var newProblem = _.cloneDeep(problem);
      if (newProblem.valueTree) {
        newProblem.criteria = _.mapValues(newProblem.criteria, function(criterion, criterionId) {
          var newCriterion = _.cloneDeep(criterion);
          if (problem.valueTree.children[0].criteria) {
            newCriterion.isFavorable = _.includes(newProblem.valueTree.children[0].criteria, criterionId);
          } else {
            newCriterion.isFavorable = _.includes(_.flatten(_.map(problem.valueTree.children[0].children, 'criteria')));
          }
          return newCriterion;
        });
        delete newProblem.valueTree;
      }
      newProblem.schemaVersion = '1.1.0';
      return newProblem;
    }


    return {
      updateProblemToCurrentSchema: updateProblemToCurrentSchema,
      updateWorkspaceToCurrentSchema: updateWorkspaceToCurrentSchema
    };
  };

  return dependencies.concat(SchemaService);
});
