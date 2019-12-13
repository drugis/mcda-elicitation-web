'use strict';
define(['jquery'], function($) {
  var dependencies = [
    '$rootScope',
    '$stateParams',
    '$modal',
    'LegendService',
    'ScenarioResource'
  ];
  var LegendDirective = function(
    $rootScope,
    $stateParams,
    $modal,
    LegendService,
    ScenarioResource
  ) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.editLegend = editLegend;
        createTooltip();

        scope.$on('elicit.legendChanged', function(_event, newLegend) {
          var btnElement = LegendService.createButtonElement(newLegend, scope.editMode.canEdit, scope);
          $(element).siblings('.legend').replaceWith(btnElement);
        });

        function createTooltip() {
          var $element = $(element);
          $element.css('float', 'left');
          var btnElement = LegendService.createButtonElement(scope.scenario.state.legend, scope.editMode.canEdit, scope);
          $element.after(btnElement);
        }

        function broadcastEvent(newLegend) {
          $rootScope.$broadcast('elicit.legendChanged', newLegend);
        }

        function editLegend() {
          $modal.open({
            templateUrl: './editLegend.html',
            controller: 'EditLegendController',
            resolve: {
              legend: function() {
                return scope.scenario.state.legend;
              },
              alternatives: function() {
                return scope.alternatives;
              },
              callback: function() {
                return function(newLegend) {
                  scope.scenario.state.legend = newLegend;
                  ScenarioResource.save($stateParams, scope.scenario)
                    .$promise.then(function() {
                      broadcastEvent(newLegend);
                    });
                };
              }
            }
          });
        }
      }
    };
  };
  return dependencies.concat(LegendDirective);
});
