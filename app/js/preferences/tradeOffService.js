'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = ['PataviResultsService'];
  var TradeOffService = function(PataviResultsService) {

    function getIndifferenceCurve(criteria, coordinates) {
      //FIXME
    }

    return {
      getIndifferenceCurve: getIndifferenceCurve
    };
  };
  return dependencies.concat(TradeOffService);
});
