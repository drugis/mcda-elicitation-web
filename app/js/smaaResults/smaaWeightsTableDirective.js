'use strict';
define(['clipboard'],
  function(Clipboard) {
    var dependencies = [];
    var ScenarioDirective = function() {
      return {
        restrict: 'E',
        scope: {
          weights: '=',
          criteria: '='
        },
        templateUrl: './smaaWeightsTableDirective.html', 
        link: function(scope){
          new Clipboard('.clipboard-button');
        }
      };
    };
    return dependencies.concat(ScenarioDirective);
  });
