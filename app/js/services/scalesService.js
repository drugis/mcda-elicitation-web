'use strict';
define(['lodash', 'angular'], function(_, angular) {

  var dependencies = ['PataviResultsService'];

  var ScalesService = function(PataviResultsService) {
    function getObservedScales(scope, problem) {
      var scalesProblem = _.extend(problem, {
        method: 'scales'
      });
      return PataviResultsService.postAndHandleResults(scalesProblem);
    }

    
    return {
      getObservedScales: getObservedScales
    };
  };

  return angular.module('elicit.scalesService', []).service('ScalesService', dependencies.concat(ScalesService));
});
