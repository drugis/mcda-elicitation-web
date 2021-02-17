import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {ChartConfiguration} from 'c3';
import {format} from 'd3';
import _ from 'lodash';
import {findScale, findValue} from '../EffectsTable/EffectsTableUtil';
import ISensitivityValue from '../interface/ISensitivityValue';
import significantDigits from '../ManualInput/Util/significantDigits';

export function getInitialSensitivityValues(
  criteria: ICriterion[],
  alternatives: IAlternative[],
  effects: Effect[],
  scales: Record<string, Record<string, IScale>>
): Record<string, Record<string, ISensitivityValue>> {
  return _.mapValues(_.keyBy(criteria, 'id'), (criterion) => {
    return _.mapValues(_.keyBy(alternatives, 'id'), (alternative) => {
      const effect = findValue(
        effects,
        criterion.dataSources[0].id,
        alternative.id
      );
      const scale = findScale(
        scales,
        criterion.dataSources[0].id,
        alternative.id
      );
      const value = getValue(effect, scale);
      return {originalValue: value, currentValue: value};
    });
  });
}

function getValue(effect: Effect, scale: IScale): number {
  if (effect) {
    switch (effect.type) {
      case 'value':
        return effect.value;
      case 'valueCI':
        return effect.value;
      case 'range':
        return significantDigits((effect.lowerBound + effect.upperBound) / 2);
      default:
        return scale['50%'];
    }
  } else {
    return scale['50%'];
  }
}

export function generateValuePlotSettings(
  profileCase: string,
  valueProfiles: Record<string, Record<string, number>>,
  criteria: ICriterion[],
  alternatives: IAlternative[],
  legend: Record<string, string>
): ChartConfiguration {
  const plotValues = pataviResultToValueProfile(
    valueProfiles,
    criteria,
    alternatives,
    legend
  );
  return {
    bindto: `#value-profile-plot-${profileCase}`,
    data: {
      x: 'x',
      columns: plotValues,
      type: 'bar',
      groups: [_.map(criteria, 'title')]
    },
    axis: {
      x: {
        type: 'category',
        tick: {
          centered: true
        }
      },
      y: {
        tick: {
          count: 5,
          format: format(',.3g')
        }
      }
    },
    grid: {
      x: {
        show: false
      },
      y: {
        show: true
      }
    },
    legend: {
      position: 'bottom'
    }
  };
}

export function pataviResultToValueProfile(
  valueProfiles: Record<string, Record<string, number>>,
  criteria: ICriterion[],
  alternatives: IAlternative[],
  legend: Record<string, string>
): [string, ...(string | number)[]][] {
  const alternativeTitles = getAlternativesTitles(alternatives, legend);
  return [
    alternativeTitles,
    ...getValueProfilePlotValues(valueProfiles, criteria, alternatives)
  ];
}

function getAlternativesTitles(
  alternatives: IAlternative[],
  legend: Record<string, string>
): [string, ...string[]] {
  return [
    'x',
    ..._.map(alternatives, (alternative: IAlternative): string =>
      legend ? legend[alternative.id] : alternative.title
    )
  ];
}

function getValueProfilePlotValues(
  valueProfiles: Record<string, Record<string, number>>,
  criteria: ICriterion[],
  alternatives: IAlternative[]
): [string, ...number[]][] {
  return _.map(criteria, (criterion) =>
    getValueData(valueProfiles, criterion, alternatives)
  );
}

function getValueData(
  valueProfiles: Record<string, Record<string, number>>,
  criterion: ICriterion,
  alternatives: IAlternative[]
): [string, ...number[]] {
  return [
    criterion.title,
    ..._.map(
      alternatives,
      (alternative: IAlternative): number =>
        valueProfiles[alternative.id][criterion.dataSources[0].id]
    )
  ];
}

export function getSensitivityLineChartSettings(
  measurementsSensitivityResults: Record<string, Record<number, number>>,
  alternatives: IAlternative[],
  legend: Record<string, string>,
  Xlabel: string,
  useTooltip: boolean,
  plotId: string
): ChartConfiguration {
  const plotValues = pataviResultToLineValues(
    measurementsSensitivityResults,
    alternatives,
    legend
  );
  const numericalPlotValues = _.map(plotValues[0].slice(1), parseFloat);
  return {
    bindto: plotId,
    data: {
      x: 'x',
      columns: plotValues
    },
    axis: {
      x: {
        label: {
          text: Xlabel,
          position: 'outer-center'
        },
        min: _.min(numericalPlotValues),
        max: _.max(numericalPlotValues),
        padding: {
          left: 0,
          right: 0
        },
        tick: {
          count: 5,
          format: format(',.3g')
        }
      },
      y: {
        label: {
          text: 'Total value',
          position: 'outer-middle'
        }
      }
    },
    grid: {
      x: {
        show: false
      },
      y: {
        show: true
      }
    },
    point: {
      show: false
    },
    tooltip: {
      show: useTooltip
    }
  };
}

export function pataviResultToLineValues(
  measurementsSensitivityResults: Record<string, Record<number, number>>,
  alternatives: IAlternative[],
  legend: Record<string, string>
): [string, ...(string | number)[]][] {
  return [
    getLineXValues(measurementsSensitivityResults, alternatives),
    ...getLineYValues(measurementsSensitivityResults, alternatives, legend)
  ];
}

function getLineXValues(
  measurementsSensitivityResults: Record<string, Record<number, number>>,
  alternatives: IAlternative[]
): ['x', ...string[]] {
  return ['x', ..._.keys(measurementsSensitivityResults[alternatives[0].id])];
}

function getLineYValues(
  measurementsSensitivityResults: Record<string, Record<number, number>>,
  alternatives: IAlternative[],
  legend: Record<string, string>
): [string, ...number[]][] {
  return _.map(alternatives, (alternative: IAlternative): [
    string,
    ...number[]
  ] => [
    legend ? legend[alternative.id] : alternative.title,
    ..._.values(measurementsSensitivityResults[alternative.id])
  ]);
}
