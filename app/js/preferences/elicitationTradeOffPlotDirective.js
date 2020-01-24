'use strict';
define(['d3', 'c3'],
  function(d3, c3) {
    var dependencies = [
      'TradeOffService'
    ];
    var ElicitationTradeOffPlotDirective = function(
      TradeOffService
    ) {
      return {
        restrict: 'E',
        scope: {
          coordRanges: '=',
          criteria: '=',
          data: '=',
          showSlider: '='
        },
        templateUrl: './elicitationTradeOffPlotDirective.html',
        link: function(scope, element) {
          var root = d3.select(element[0]);
          root = root.select('#tradeOffPlot');
          root.append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'white');
          root
            .style('width', '300px')
            .style('height', '300px')
            .style('background', 'white');

          var settings = TradeOffService.getInitialSettings(root, scope.data, scope.coordRanges, scope.criteria);
          settings.legend.show = false;
          settings.axis.x.tick.count = 5;
          settings.axis.y.tick.count = 5;

          c3.generate(settings);
          scope.showSlider = false;
        }
      };
    };
    return dependencies.concat(ElicitationTradeOffPlotDirective);
  });
