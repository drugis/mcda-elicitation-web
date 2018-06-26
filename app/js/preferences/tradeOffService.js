'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = ['PataviResultsService'];
  var TradeOffService = function(PataviResultsService) {
    function getIndifferenceCurve(problem, criteria, coordinates) {
      var newProblem = _.merge({}, problem, {
        method: 'indifferenceCurve',
        indifferenceCurve: {
          criterionX: criteria.firstCriterion.id,
          criterionY: criteria.secondCriterion.id,
          x: coordinates.x,
          y: coordinates.y
        }
      });
      newProblem.criteria = _.mapValues(newProblem.criteria, function(criterion){
        return _.merge({}, _.omit(criterion, ['dataSources']), _.omit(criterion.dataSources[0]), []);
      });
      return PataviResultsService.postAndHandleResults(newProblem);
    }

    return {
      getIndifferenceCurve: getIndifferenceCurve
    };
  };
  return dependencies.concat(TradeOffService);
});
