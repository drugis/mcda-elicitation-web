import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {PreferenceSensitivityParameter} from 'app/ts/type/preferenceSensitivityParameter';
import {ChartConfiguration} from 'c3';
import {format} from 'd3';
import _ from 'lodash';
import {getPercentifiedValueLabel} from '../../../../../DisplayUtil/DisplayUtil';
import {
  findScale,
  findValue
} from '../../../../../EffectsTable/EffectsTableUtil';
import IChangeableValue from '../../../../../interface/IChangeableValue';
import significantDigits from '../../../../../util/significantDigits';

export function getInitialSensitivityValues(
  criteria: ICriterion[],
  alternatives: IAlternative[],
  effects: Effect[],
  scales: Record<string, Record<string, IScale>>
): Record<string, Record<string, IChangeableValue>> {
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
  criteria: ICriterion[],
  plotValues: [string, ...(string | number)[]][]
): ChartConfiguration {
  return {
    bindto: `#value-profile-plot-${profileCase}`,
    data: {
      x: 'x',
      columns: plotValues,
      type: 'bar',
      groups: [_.map(criteria, 'title')],
      order: null
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

export function pataviResultToAbsoluteValueProfile(
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

export function pataviResultToRelativeValueProfile(
  valueProfiles: Record<string, Record<string, number>>,
  criteria: ICriterion[],
  [reference, comparator]: IAlternative[],
  legend: Record<string, string>
): [string, ...(string | number)[]][] {
  const alternativeTitles = getAlternativesTitles(
    [reference, comparator],
    legend
  );
  return [
    alternativeTitles,
    ...getRelativeValueProfilePlotValues(valueProfiles, criteria, [
      reference,
      comparator
    ])
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

function getRelativeValueProfilePlotValues(
  valueProfiles: Record<string, Record<string, number>>,
  criteria: ICriterion[],
  alternatives: [IAlternative, IAlternative]
): [string, ...number[]][] {
  return _.map(criteria, (criterion) =>
    getRelativeValueData(valueProfiles, criterion, alternatives)
  );
}

function getRelativeValueData(
  valueProfiles: Record<string, Record<string, number>>,
  criterion: ICriterion,
  [reference, comparator]: [IAlternative, IAlternative]
): [string, ...number[]] {
  const referenceValue = valueProfiles[reference.id][criterion.id];
  const comparatorValue = valueProfiles[comparator.id][criterion.id];
  const relativeValue = referenceValue - comparatorValue;
  return [
    criterion.title,
    relativeValue > 0 ? relativeValue : null,
    relativeValue < 0 ? Math.abs(relativeValue) : null
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
        valueProfiles[alternative.id][criterion.id]
    )
  ];
}

export function getSensitivityLineChartSettings(
  measurementsSensitivityResults: Record<string, Record<number, number>>,
  parameter: PreferenceSensitivityParameter,
  alternatives: IAlternative[],
  legend: Record<string, string>,
  Xlabel: string,
  useTooltip: boolean,
  plotId: string,
  usePercentage: boolean
): ChartConfiguration {
  const plotValues = pataviResultToLineValues(
    measurementsSensitivityResults,
    parameter,
    alternatives,
    legend,
    usePercentage
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
  parameter: PreferenceSensitivityParameter,
  alternatives: IAlternative[],
  legend: Record<string, string>,
  usePercentage: boolean
): [string, ...(string | number)[]][] {
  return [
    getLineXValues(
      measurementsSensitivityResults,
      parameter,
      alternatives,
      usePercentage
    ),
    ...getLineYValues(measurementsSensitivityResults, alternatives, legend)
  ];
}

function getLineXValues(
  measurementsSensitivityResults: Record<string, Record<number, number>>,
  parameter: PreferenceSensitivityParameter,
  alternatives: IAlternative[],
  usePercentage: boolean
): ['x', ...string[]] {
  return [
    'x',
    ..._(measurementsSensitivityResults[alternatives[0].id])
      .keys()
      .map((value: string): string => {
        const valueAsNumber = parseFloat(value);
        return getPercentifiedValueLabel(valueAsNumber, usePercentage);
      })
      .value()
  ];
}

function getLineYValues(
  measurementsSensitivityResults: Record<string, Record<number, number>>,
  alternatives: IAlternative[],
  legend: Record<string, string>
): [string, ...number[]][] {
  return _.map(
    alternatives,
    (alternative: IAlternative): [string, ...number[]] => [
      legend ? legend[alternative.id] : alternative.title,
      ..._.values(measurementsSensitivityResults[alternative.id])
    ]
  );
}

export function calcImportances(
  valueProfiles: Record<string, Record<string, number>>,
  alternatives: IAlternative[]
): Record<string, number> {
  const [referenceValues, comparatorValues] = _.values(
    _.pick(valueProfiles, _.map(alternatives, 'id'))
  );
  const diffs = _.mapValues(
    referenceValues,
    (referenceValue: number, key: string): number =>
      referenceValue - comparatorValues[key]
  );
  const largestDiff = _.max(_.map(_.values(diffs), (diff) => Math.abs(diff)));
  return _.mapValues(diffs, (diff) => (100 * Math.abs(diff)) / largestDiff);
}

export function calcInitialEquivalentChangeRange(): [number, number] {
  return [0.1, 0.9];
}
