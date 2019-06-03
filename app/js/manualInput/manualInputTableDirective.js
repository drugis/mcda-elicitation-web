'use strict';
define([], function() {
  var dependencies = [
  ];
  var manualInputTableDirective = function() {
    return {
      restrict: 'E',
      scope: {
        'inputType': '=',
        'state': '=',
        'criteriaRows': '=',
        'checkInputData': '='
      },
      templateUrl: './manualInputTableDirective.html',
      link: function(scope) {}
    };
  };
  return dependencies.concat(manualInputTableDirective);
});
