'use strict';
define([], function() {
  var tasks = {
    'available' : [
      { id: 'overview',
        title: 'Overview',
        controller: 'OverviewController',
        templateUrl: 'overview.html',
        requires: [],
        resets: [] },
      { id: 'scale-range',
        title: 'Define Scale Range',
        controller: 'ScaleRangeController',
        templateUrl: 'scaleRange.html',
        requires: [],
        resets: ['scale-ranges', 'partial-value-functions', 'criteria-trade-offs'] },
      { id: 'partial-value-function',
        title: 'Define Partial Value Functions',
        controller: 'PartialValueFunctionController',
        templateUrl: 'partialValueFunction.html',
        requires: ['scale-ranges'],
        resets: ['partial-value-functions', 'criteria-trade-offs'] },
      { id: 'ordinal-swing',
        title: 'Ordinal Swing Elicitation',
        controller: 'OrdinalSwingController',
        templateUrl: 'ordinalSwing.html',
        requires: ['partial-value-functions'],
        resets: ['criteria-trade-offs']},
      { id: 'interval-swing',
        title: 'Interval Swing Elicitation',
        controller: 'IntervalSwingController',
        templateUrl: 'intervalSwing.html',
        requires: ['complete-criteria-ranking'],
        resets: ['non-ordinal-preferences']},
      { id: 'exact-swing',
        title: 'Exact Swing Elicitation',
        controller: 'ExactSwingController',
        templateUrl: 'exactSwing.html',
        requires: ['complete-criteria-ranking'],
        resets: ['non-ordinal-preferences']},
      { id: 'results',
        title: 'Results',
        controller: 'ResultsController',
        templateUrl: 'results.html',
        requires: ['scale-ranges', 'partial-value-functions'],
        resets: []}
    ]};

  var defaultView = 'overview';

  var createPath = function(basePath, workspaceId, scenarioId, taskId) {
    var taskId = taskId ? taskId : defaultView,
        base = basePath.indexOf('#/workspaces/') === 0 ? basePath : stripBasePath(basePath);

    return '#/' + base + '/' + workspaceId + '/scenarios/' + scenarioId + '/' + taskId;
  };


  var stripBasePath = function(basePath) {
    // keep '#' in at the front of the path
    return basePath.substr(1, basePath.lastIndexOf('analyses') + 'analyses'.length - 1);
  }

  return {
    tasks: tasks,
    defaultView: defaultView,
    createPath: createPath
  };
});
