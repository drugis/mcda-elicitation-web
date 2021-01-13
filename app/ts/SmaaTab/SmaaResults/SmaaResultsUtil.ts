import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import {IPataviCriterion} from '@shared/interface/Patavi/IPataviCriterion';
import {IPataviTableEntry} from '@shared/interface/Patavi/IPataviTableEntry';
import {DistributionPerformance} from '@shared/interface/Problem/IDistributionPerformance';
import {EffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import {
  IDistributionPerformance,
  IEffectPerformance,
  Performance
} from '@shared/interface/Problem/IPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {TRelativePerformance} from '@shared/interface/Problem/IProblemRelativePerformance';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {TPreferences} from '@shared/types/Preferences';
import {ChartConfiguration, Primitive} from 'c3';
import {format} from 'd3';
import _ from 'lodash';

export function hasStochasticMeasurements(
  filteredDistributions: Distribution[]
): boolean {
  return _.some(
    filteredDistributions,
    (distribution: Distribution) =>
      distribution.type !== 'value' &&
      distribution.type !== 'empty' &&
      distribution.type !== 'text'
  );
}

export function hasStochasticWeights(preferences: TPreferences) {
  const NON_EXACT_PREFERENCE_TYPES = ['ordinal', 'ratio bound'];
  return (
    _.isEmpty(preferences) ||
    _.some(
      preferences,
      (preference: IRanking | IExactSwingRatio | IRatioBoundConstraint) =>
        NON_EXACT_PREFERENCE_TYPES.indexOf(preference.type) >= 0
    )
  );
}

export function getSmaaWarnings(
  useMeasurementsUncertainty: boolean,
  useWeightsUncertainty: boolean,
  problemHasStochasticMeasurements: boolean,
  problemHasStochasticWeights: boolean
): string[] {
  let warnings: string[] = [];
  if (!useMeasurementsUncertainty && !useWeightsUncertainty) {
    warnings.push(
      'SMAA results will be identical to the deterministic results because there are no stochastic inputs'
    );
  }
  if (!problemHasStochasticMeasurements) {
    warnings.push('Measurements are not stochastic');
  }
  if (!problemHasStochasticWeights) {
    warnings.push('Weights are not stochastic');
  }
  return warnings;
}

export function mergeDataSourceOntoCriterion(
  criteria: Record<string, IProblemCriterion>
): Record<string, IPataviCriterion> {
  return _.mapValues(
    criteria,
    (criterion: IProblemCriterion): IPataviCriterion => {
      return {
        id: criterion.id,
        title: criterion.title,
        pvf: criterion.dataSources[0].pvf,
        scale: criterion.dataSources[0].scale,
        unitOfMeasurement: criterion.dataSources[0].unitOfMeasurement
      };
    }
  );
}

export function buildPataviPerformanceTable(
  performanceTable: IPerformanceTableEntry[]
): IPataviTableEntry[] {
  return _.map(performanceTable, (entry: IPerformanceTableEntry) => {
    return {...entry, performance: getPerformance(entry.performance)};
  });
}

function getPerformance(
  performance: Performance
): EffectPerformance | DistributionPerformance | TRelativePerformance {
  if (
    isDistributionPerformance(performance) &&
    performance.distribution.type !== 'empty'
  ) {
    return performance.distribution;
  } else if (isEffectPerformance(performance)) {
    return performance.effect;
  } else {
    throw 'Unrecognized performance';
  }
}

function isDistributionPerformance(
  performance: Performance
): performance is IDistributionPerformance {
  return performance.hasOwnProperty('distribution');
}

function isEffectPerformance(
  performance: Performance
): performance is IEffectPerformance {
  return performance.hasOwnProperty('effect');
}

export function generateRankPlotSettings(
  ranks: Record<string, number[]>,
  alternatives: IAlternative[],
  legend: Record<string, string>
): ChartConfiguration {
  const rankTitles = _.map(alternatives, (alternative, index) => {
    return 'Rank ' + (index + 1);
  });
  const rankPlotData = getRankPlotData(ranks, alternatives, legend);
  const settings: ChartConfiguration = {
    bindto: '#rank-acceptabilities-plot',
    data: {
      x: 'x',
      columns: rankPlotData,
      type: 'bar',
      groups: [rankTitles]
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
        },
        min: 0,
        max: 1,
        padding: {
          top: 0,
          bottom: 0
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
  return settings;
}

export function getRankPlotData(
  ranks: Record<string, number[]>,
  alternatives: IAlternative[],
  legend: Record<string, string>
): [string, ...Primitive[]][] {
  const titleRow = getPlotTitles(alternatives, legend);
  return [...titleRow, ...getRankPlotValues(ranks, alternatives)];
}

function getPlotTitles<T extends {id: string; title: string}>(
  items: T[],
  legend: Record<string, string>
): [[string, ...string[]]] {
  return [
    [
      'x',
      ..._.map(items, (item: T): string =>
        legend ? legend[item.id] : item.title
      )
    ]
  ];
}

function getRankPlotValues(
  ranks: Record<string, number[]>,
  alternatives: IAlternative[]
): [string, ...number[]][] {
  return _.map(alternatives, (alternative: IAlternative, rankIndex: number) => {
    return [`Rank ${rankIndex + 1}`, ..._.values(ranks[alternative.id])];
  });
}

export function generateCentralWeightsPlotSettings(
  centralWeights: Record<string, ICentralWeight>,
  criteria: ICriterion[],
  alternatives: IAlternative[],
  legend: Record<string, string>
): ChartConfiguration {
  const centralWeightsPlotData = getCentralWeightsPlotData(
    centralWeights,
    criteria,
    alternatives,
    legend
  );
  const settings: ChartConfiguration = {
    bindto: '#central-weights-plot',
    data: {
      x: 'x',
      columns: centralWeightsPlotData,
      type: 'bar'
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
  return settings;
}

export function getCentralWeightsPlotData(
  centralWeights: Record<string, ICentralWeight>,
  criteria: ICriterion[],
  alternatives: IAlternative[],
  legend: Record<string, string>
): [string, ...Primitive[]][] {
  const titleRow: [[string, ...string[]]] = [
    ['x', ..._.map(criteria, 'title')]
  ];
  return [
    ...titleRow,
    ...getCentralWeightsPlotValues(
      centralWeights,
      criteria,
      alternatives,
      legend
    )
  ];
}

function getCentralWeightsPlotValues(
  centralWeights: Record<string, ICentralWeight>,
  criteria: ICriterion[],
  alternatives: IAlternative[],
  legend: Record<string, string>
): [string, ...number[]][] {
  return _.map(alternatives, (alternative: IAlternative): [
    string,
    ...number[]
  ] => {
    return [
      legend ? legend[alternative.id] : alternative.title,
      ...getCentralWeightsForAlternative(
        centralWeights,
        alternative.id,
        criteria
      )
    ];
  });
}

function getCentralWeightsForAlternative(
  centralWeights: Record<string, ICentralWeight>,
  alternativeId: string,
  criteria: ICriterion[]
): number[] {
  return _.map(
    criteria,
    (criterion: ICriterion) => centralWeights[alternativeId].w[criterion.id]
  );
}
