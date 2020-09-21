'use strict';
define(['clipboard'], function (Clipboard) {
  var dependencies = [];
  var SmaaWeightsTableDirective = function () {
    return {
      restrict: 'E',
      scope: {
        weights: '=',
        criteria: '='
      },
      templateUrl: './smaaWeightsTableDirective.html',
      link: function () {
        new Clipboard('.clipboard-button');
      }
    };
  };
  return dependencies.concat(SmaaWeightsTableDirective);
});
