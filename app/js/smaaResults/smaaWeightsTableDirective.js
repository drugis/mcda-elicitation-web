'use strict';
define([],
  function() {
    var dependencies = [];
    var ScenarioDirective = function() {
      return {
        restrict: 'E',
        scope: {
          weights: '=',
          criteria: '='
        },
        templateUrl: './smaaWeightsTableDirective.html'
      };
    };
    return dependencies.concat(ScenarioDirective);
  });
