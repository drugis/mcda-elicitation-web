'use strict';
define([
  'd3',
  'jquery'
], function(
  d3,
  $
) {
  var dependencies = [];

  var HeatMap = function() {
    return {
      restrict: 'C',
      replace: false,
      transclude: false,
      scope: false,
      link: function(scope, element) {
        scope.$watch(element, function() {
          var value = parseFloat(element[0].innerHTML);
          var color = d3.scaleQuantile().range(d3.range(9)).domain([1, 0]);
          $(element[0].parentNode).addClass('RdYlGn');
          $(element[0]).addClass('q' + color(value) + '-9');
        });
      }
    };
  };
  return dependencies.concat(HeatMap);
});
