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

    function updateProblemToCurrentSchema(problem) {
      var newProblem = angular.copy(problem);
      if (!problem.schemaVersion) {
        newProblem = updateToVersionOnePointZeroPointZero(newProblem);
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
      problem.criteria = _.mapValues(problem.criteria, function(criterion, criterionId) {
        var newCriterion = _.pick(criterion, ['title', 'description', 'unitOfMeasurement', 'scale']);
        var dataSource = _.pick(criterion, ['pvf', 'source', 'sourceLink', 'strengthOfEvidence', 'uncertainties']);
        dataSource.id = generateUuid();

        var tableEntry = _.find(problem.performanceTable, ['criterion', criterionId]);
        var MANUAL_DISTRIBUTIONS = ['exact', 'dnorm', 'dbeta', 'dgamma'];
        var performanceType = tableEntry.performance.type;
        if (_.includes(MANUAL_DISTRIBUTIONS, performanceType)) {
          dataSource.inputType= 'distribution';
          dataSource.inputMethod= 'manualDistribution';
        } else if (performanceType === 'dt') {
          dataSource.inputType= 'distribution';
          dataSource.inputMethod= 'assistedDistribution';
          dataSource.dataType= 'continuous';
        }

        newCriterion.dataSources = [dataSource];
        return newCriterion;
      });
      problem.performanceTable = _.map(problem.performanceTable, function(tableEntry) {
        var newEntry = angular.copy(tableEntry);
        newEntry.dataSource = problem.criteria[tableEntry.criterion].dataSources[0].id;
        return newEntry;
      });
      problem.schemaVersion = '1.0.0';
      return problem;
    }
    return {
      updateProblemToCurrentSchema: updateProblemToCurrentSchema,
      updateWorkspaceToCurrentSchema:updateWorkspaceToCurrentSchema
    };
  };

  return dependencies.concat(SchemaService);
});
