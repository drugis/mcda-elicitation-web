'use strict';
define(function () {
  var tasks = {
    available: [
      {
        id: 'evidence',
        title: 'Evidence',
        controller: 'EvidenceController',
        templateUrl: './evidence/evidence.html',
        requires: [],
        resets: []
      },
      {
        id: 'preferences',
        title: 'Preferences',
        controller: 'PreferencesController',
        templateUrl: './preferences/preferences.html',
        requires: ['scale-range'],
        resets: []
      },
      {
        id: 'results',
        title: 'Results',
        requires: ['scale-range', 'partial-value-function'],
        redirectTo: 'smaa-results',
        resets: []
      },
      {
        id: 'smaa-results',
        title: 'Smaa results',
        controller: 'SmaaResultsController',
        templateUrl: './smaaResults/smaaResults.html',
        requires: ['scale-range', 'partial-value-function'],
        resets: []
      },
      {
        id: 'deterministic-results',
        title: 'Deterministic results',
        controller: 'DeterministicResultsController',
        templateUrl: './deterministicResults/deterministicResults.html',
        requires: ['scale-range', 'partial-value-function'],
        resets: []
      },
      {
        id: 'problem',
        title: 'Problem',
        controller: 'SubProblemController',
        templateUrl: './subProblem/subProblem.html',
        requires: [],
        resets: []
      }
    ]
  };

  var defaultView = 'evidence';

  return {
    tasks: tasks,
    defaultView: defaultView
  };
});
