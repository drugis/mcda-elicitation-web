'use strict';
define(['clipboard'],
  function(Clipboard) {
    var dependencies = [];
    var CentralWeightsDirective = function() {
      return {
        restrict: 'E',
        scope: {
          alternatives: '=',
          criteria: '=',
          editMode: '=',
          scenario: '=',
          state: '='
        },
        templateUrl: './centralWeightsDirective.html',
        link: function() {
          new Clipboard('.clipboard-button');
        }
      };
    };
    return dependencies.concat(CentralWeightsDirective);
  });
