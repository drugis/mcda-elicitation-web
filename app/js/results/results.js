'use strict';
var requires = [
'mcda/results/smaaResultsController',
  'mcda/results/deterministicResultsController',
  'mcda/results/sensitivityInputDirective',
  'mcda/results/valueProfilePlotDirective',
  'mcda/results/legendDirective',
  'mcda/results/resultsService'
];
define(['angular'].concat(requires), function(
  angular,
  SmaaResultsController,
  DeterministicResultsController,
  sensitivityInputDirective,
  valueProfilePlotDirective,
  legendDirective,
  MCDAResultsService
) {
  return angular.module('elicit.results', ['patavi', 'rzModule'])

    .controller('SmaaResultsController', SmaaResultsController)
    .controller('DeterministicResultsController', DeterministicResultsController)
    .directive('sensitivityInput', sensitivityInputDirective)
    .directive('valueProfilePlot', valueProfilePlotDirective)
    .directive('legend', legendDirective)
    .factory('MCDAResultsService', MCDAResultsService)
    ;

});