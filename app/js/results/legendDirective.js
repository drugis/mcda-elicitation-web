'use strict';
define(['lodash', 'jQuery'], function(_, $) {
  var dependencies = ['$stateParams', '$modal', '$compile', 'ScenarioResource'];
  var LegendDirective = function($stateParams, $modal, $compile, ScenarioResource) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.editLegend = editLegend;
        var $element = $(element);
        $element.css('float', 'left');

        var tooltipHtml;
        if (scope.scenario.state.legend) {
          var tableCells = _.reduce(scope.scenario.state.legend, function(accum, alt) {
            return accum + '<tr><td><b>' + alt.newTitle + '</b>:</td>' + '<td>' + alt.baseTitle + '</td></tr>';
          }, '');
          tooltipHtml = '<table class=\'legend-table\'>' +
            '<tbody>' +
            tableCells +
            '</tbody>' +
            '</table>' +
            (scope.editMode.isUserOwner ? 'Click to change' : '');
        } else {
          tooltipHtml = scope.editMode.isUserOwner ? 
            'Please click the button to create aliases for the alternatives to use in plots' :
            'No legend set.';
        }
        var btnElement = $compile('<br><button ' +
          (scope.editMode.isUserOwner ? 'ng-click="editLegend()" ' : '') +
          'class="button export-button info small" ' +
          'tooltip-append-to-body="true" ' +
          'tooltip-html-unsafe="' +
          tooltipHtml + '">' +
          'Labels</button>')(scope);
        $element.after(btnElement);

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
                  ScenarioResource.save($stateParams, scope.scenario).$promise.then(scope.loadState);
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
