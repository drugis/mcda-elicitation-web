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

    function updateProblemToCurrentSchema(workspace) {
      var newWorkspace = angular.copy(workspace);
      if (!workspace.schemaVersion) {
        newWorkspace = updateToVersionOnePointZeroPointzero(workspace);
      }
      if (newWorkspace.schemaVersion === currentSchemaVersion) {
        return newWorkspace;
      }
    }

    //private 
    function updateToVersionOnePointZeroPointzero(newWorkspace) {
      newWorkspace.problem.criteria = _.mapValues(newWorkspace.problem.criteria, function(criterion, criterionId) {
        var newCriterion = _.pick(criterion, ['title', 'description', 'unitOfMeasurement', 'scale']);
        var dataSource = _.pick(criterion, ['pvf', 'source', 'sourceLink', 'strengthOfEvidence', 'uncertainties']);
        dataSource.id = generateUuid();

        var tableEntry = _.find(newWorkspace.problem.performanceTable, ['criterion', criterionId]);
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
      newWorkspace.problem.performanceTable = _.map(newWorkspace.problem.performanceTable, function(tableEntry) {
        var newEntry = angular.copy(tableEntry);
        newEntry.dataSource = newWorkspace.problem.criteria[tableEntry.criterion].dataSources[0].id;
        return newEntry;
      });
      newWorkspace.schemaVersion = '1.0.0';
      return newWorkspace;
    }
    return {
      updateProblemToCurrentSchema: updateProblemToCurrentSchema
    };
  };

  return dependencies.concat(SchemaService);
});
