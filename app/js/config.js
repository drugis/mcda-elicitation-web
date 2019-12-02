'use strict';
define(function() {
  var tasks = {
    available: [{
      id: 'evidence',
      title: 'Evidence',
      controller: 'EvidenceController',
      templateUrl: './evidence/evidence.html',
      requires: [],
      resets: []
    }, {
      id: 'partial-value-function',
      url: '/partial-value-function/:criterion',
      title: 'Define Partial Value Functions',
      controller: 'PartialValueFunctionController',
      templateUrl: './preferences/partialValueFunction.html',
      requires: [],
      resets: ['criteria-trade-offs']
    }, {
      id: 'ordinal-swing',
      title: 'Ranking',
      controller: 'OrdinalSwingController',
      templateUrl: './preferences/ordinalSwing.html',
      requires: ['partial-value-function'],
      resets: ['criteria-trade-offs']
    }, {
      id: 'matching',
      title: 'Matching',
      controller: 'MatchingElicitationController',
      templateUrl: './preferences/matchingElicitation.html',
      requires: ['partial-value-function'],
      resets: ['criteria-trade-offs']
    }, {
      id: 'swing-weighting',
      title: 'Swing Weighting Elicitation',
      controller: 'SwingWeightingController',
      templateUrl: './preferences/swingWeighting.html',
      requires: ['partial-value-function'],
      resets: ['criteria-trade-offs']
    }, {
      id: 'imprecise-swing-weighting',
      title: 'Imprecise Swing Weighting Elicitation',
      controller: 'ImpreciseSwingWeightingController',
      templateUrl: './preferences/swingWeighting.html',
      requires: ['partial-value-function'],
      resets: ['criteria-trade-offs']
    }, {
      id: 'preferences',
      title: 'Preferences',
      controller: 'PreferencesController',
      templateUrl: './preferences/preferences.html',
      requires: ['scale-range'],
      resets: []
    }, {
      id: 'results',
      title: 'Results',
      requires: ['scale-range', 'partial-value-function'],
      redirectTo: 'smaa-results',
      resets: []
    }, {
      id: 'smaa-results',
      title: 'Smaa results',
      controller: 'SmaaResultsController',
      templateUrl: './smaaResults/smaaResults.html',
      requires: ['scale-range', 'partial-value-function'],
      resets: []
    }, {
      id: 'deterministic-results',
      title: 'Deterministic results',
      controller: 'DeterministicResultsController',
      templateUrl: './deterministicResults/deterministicResults.html',
      requires: ['scale-range', 'partial-value-function'],
      resets: []
    }, {
      id: 'problem',
      title: 'Problem',
      controller: 'SubProblemController',
      templateUrl: './subProblem/subProblem.html',
      requires: [],
      resets: []
    }]
  };

  var defaultView = 'evidence';

  return {
    tasks: tasks,
    defaultView: defaultView
  };
});
