'use strict';
define(['clipboard'],
  function(Clipboard) {
    var dependencies = [];
    var ValueProfilesDirective = function() {
      return {
        restrict: 'E',
        scope: {
          alternatives: '=',
          criteria: '=',
          editMode:'=',
          results:'=',
          recalculatedResults: '=',
          scenario: '='
        },
        templateUrl: './valueProfilesDirective.html', 
        link: function(){
          new Clipboard('.clipboard-button');
        }
      };
    };
    return dependencies.concat(ValueProfilesDirective);
  });
