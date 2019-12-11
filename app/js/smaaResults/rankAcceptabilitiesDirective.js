'use strict';
define(['clipboard'],
  function(Clipboard) {
    var dependencies = [];
    var RankAcceptabilitiesDirective = function() {
      return {
        restrict: 'E',
        scope: {
          alternatives: '=',
          editMode: '=',
          scenario: '=',
          state: '='
        },
        templateUrl: './rankAcceptabilitiesDirective.html',
        link: function() {
          new Clipboard('.clipboard-button');
        }
      };
    };
    return dependencies.concat(RankAcceptabilitiesDirective);
  });
