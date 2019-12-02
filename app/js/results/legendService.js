'use strict';
define([
  'lodash',
], function(
  _
) {
  var dependencies = [
    '$compile'
  ];

  var LegendService = function(
    $compile
  ) {

    function replaceAlternativeNames(legend, state) {
      if (!legend) {
        return state;
      }
      var newState = _.cloneDeep(state);
      newState.problem.alternatives = _.reduce(state.problem.alternatives, function(accum, alternative, alternativeKey) {
        var newAlternative = _.cloneDeep(alternative);
        newAlternative.title = legend[alternativeKey].newTitle;
        accum[alternativeKey] = newAlternative;
        return accum;
      }, {});
      return newState;
    }

    function createButtonElement(legend, canEdit, scope) {
      var tooltipHtml = createTooltipHtml(legend, canEdit);
      return $compile('<br><button ' +
        (canEdit ? 'ng-click="editLegend()" ' : '') +
        'class="button export-button info small" ' +
        'tooltip-append-to-body="true" ' +
        'tooltip-html-unsafe="' +
        tooltipHtml + '">' +

        'Labels</button>')(scope);
    }

    function createTooltipHtml(legend, canEdit) {
      if (legend) {
        var tableCells = createTableCells(legend);
        return '<table class=\'legend-table\'>' +
          '<tbody>' +
          tableCells +
          '</tbody>' +
          '</table>' +
          (canEdit ? 'Click to change' : '');
      } else {
        return canEdit ?
          'Please click the button to create aliases for the alternatives to use in plots.' :
          'No legend set.';
      }
    }

    function createTableCells(legend) {
      return _.reduce(legend, function(accum, alternative) {
        return accum + '<tr><td><b>' + alternative.newTitle + '</b>:</td>' + '<td>' + alternative.baseTitle + '</td></tr>';
      }, '');
    }

    return {
      replaceAlternativeNames: replaceAlternativeNames,
      createButtonElement: createButtonElement
    };
  };

  return dependencies.concat(LegendService);
});
