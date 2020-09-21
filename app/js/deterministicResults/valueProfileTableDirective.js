'use strict';
define(['clipboard'], function (Clipboard) {
  var dependencies = [];
  var ValueProfileTableDirective = function () {
    return {
      restrict: 'E',
      scope: {
        alternatives: '=',
        alternativesLegend: '=',
        case: '=',
        criteria: '=',
        data: '='
      },
      templateUrl: './valueProfileTableDirective.html',
      link: function () {
        new Clipboard('.clipboard-button');
      }
    };
  };
  return dependencies.concat(ValueProfileTableDirective);
});
