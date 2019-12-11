'use strict';
define(['clipboard'],
  function(Clipboard) {
    var dependencies = [];
    var DeterministicWeightsTableDirective = function() {
      return {
        restrict: 'E',
        scope: {
          weights: '=',
          criteria: '='
        },
        templateUrl: './deterministicWeightsTableDirective.html', 
        link: function(){
          new Clipboard('.clipboard-button');
        }
      };
    };
    return dependencies.concat(DeterministicWeightsTableDirective);
  });
