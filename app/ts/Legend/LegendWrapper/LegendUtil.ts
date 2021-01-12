import IAlternative from '@shared/interface/IAlternative';
import _ from 'lodash';

export function generateLegendTooltip(
  alternatives: IAlternative[],
  legend: Record<string, string>,
  canEdit: boolean
) {
  if (legend) {
    const legendInfo =
      '<table class="legend-table"><tbody>' +
      buildLegendCells(alternatives, legend) +
      '</tbody><table>';
    return canEdit ? legendInfo + 'Click to change' : legendInfo;
  } else {
    return canEdit
      ? 'Please click the button to create aliases for the alternatives to use in plots.'
      : 'No legend set.';
  }
}

function buildLegendCells(
  alternatives: IAlternative[],
  legend: Record<string, string>
): string {
  return _.reduce(
    alternatives,
    (accum, alternative: IAlternative) => {
      return (
        accum +
        `<tr><td><b>${legend[alternative.id]}</b>:</td><td>${
          alternative.title
        }</td></tr>`
      );
    },
    ''
  );
}

export function initLegend(
  legend: Record<string, string>,
  alternatives: IAlternative[]
): Record<string, string> {
  return legend
    ? legend
    : _(alternatives).keyBy('id').mapValues('title').value();
}
