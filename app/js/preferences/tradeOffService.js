'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = ['PataviResultsService'];
  var TradeOffService = function(PataviResultsService) {

    function getIndifferenceCurve(problem,criteria, coordinates) {
      var newProblem = _.merge({}, problem, {
        indifferenceCurve:{
          criterionX: criteria.firstCriterion.id,
          criterionY: criteria.secondCriterion.id,
          x: coordinates.x,
          y: coordinates.y
        }
      });
      return PataviResultsService.postAndHandleResults(newProblem);
    }

    return {
      getIndifferenceCurve: getIndifferenceCurve
    };
  };
  return dependencies.concat(TradeOffService);
});
