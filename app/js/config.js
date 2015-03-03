'use strict';
define(function(require) {
  var tasks = {
    'available': [{
      id: 'overview',
      title: 'Overview',
      controller: 'OverviewController',
      templateUrl: 'overview.html',
      activeTab: "overview",
      requires: [],
      resets: []
    }, {
      id: 'scale-range',
      title: 'Define Scale Range',
      controller: 'ScaleRangeController',
      templateUrl: 'scaleRange.html',
      requires: [],
      activeTab: "preferences",
      resets: ['partial-value-function', 'criteria-trade-offs']
    }, {
      id: 'partial-value-function',
      url: '/partial-value-function/:criterion',
      title: 'Define Partial Value Functions',
      controller: 'PartialValueFunctionController',
      templateUrl: 'partialValueFunction.html',
      requires: ['scale-range'],
      activeTab: "preferences",
      resets: ['criteria-trade-offs']
    }, {
      id: 'ordinal-swing',
      title: 'Ordinal Swing Elicitation',
      controller: 'OrdinalSwingController',
      templateUrl: 'ordinalSwing.html',
      requires: ['partial-value-function'],
      activeTab: "preferences",
      resets: ['non-ordinal-preferences']
    }, {
      id: 'interval-swing',
      title: 'Interval Swing Elicitation',
      controller: 'IntervalSwingController',
      templateUrl: 'intervalSwing.html',
      isPreference: true,
      requires: ['complete-criteria-ranking'],
      resets: ['non-ordinal-preferences']
    }, {
      id: 'exact-swing',
      title: 'Exact Swing Elicitation',
      controller: 'ExactSwingController',
      templateUrl: 'exactSwing.html',
      activeTab: "preferences",
      requires: ['complete-criteria-ranking'],
      resets: ['non-ordinal-preferences']
    }, {
      id: 'preferences',
      title: 'Preferences',
      controller: 'PreferencesController',
      templateUrl: 'preferences.html',
      activeTab: "preferences",
      requires: [],
      resets: []
    }, {
      id: 'results',
      title: 'Results',
      controller: 'ResultsController',
      templateUrl: 'results.html',
      activeTab: "results",
      requires: ['scale-range', 'partial-value-function'],
      resets: []
    }, {
      id: 'effects-table',
      title: 'Effects table',
      controller: 'EffectsTableController',
      templateUrl: 'effectsTable.html',
      activeTab: "effects-table",
      requires: ['scale-range', 'partial-value-function'],
      resets: []
    }]
  };

  var defaultView = 'overview';

  return {
    tasks: tasks,
    defaultView: defaultView,
    pataviService: 'smaa_v2'
  };
});
