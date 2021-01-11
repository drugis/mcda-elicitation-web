import IAlternative from '@shared/interface/IAlternative';
import {Distribution} from '@shared/interface/IDistribution';
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
import {ChartConfiguration} from 'c3';
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

export function buildPataviPerformaceTable(
  performanceTable: IPerformanceTableEntry[]
): IPataviTableEntry[] {
  return _.map(performanceTable, (entry: IPerformanceTableEntry) => {
    return {...entry, performance: getPerformance(entry.performance)};
  });
}

function getPerformance(
  performance: Performance
): EffectPerformance | DistributionPerformance | TRelativePerformance {
  performance: Performance;
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
  legend: any
): ChartConfiguration {
  const rankTitles = _.map(alternatives, function (alternative, index) {
    return 'Rank ' + (index + 1);
  });
  const values = smaaResultsToRankPlotValues(ranks, alternatives, legend);
  const settings = {
    bindto: '#rank-acceptability-plot',
    data: {
      x: 'x',
      columns: values,
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
          count: 5
          // format: d3.format(',.3g')
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
  return settings as ChartConfiguration;
}

function smaaResultsToRankPlotValues(
  ranks: Record<string, number[]>,
  alternatives: IAlternative[],
  legend: any
) {
  const values = getRankPlotTitles(alternatives, legend);
  return values.concat(getRankPlotValues(ranks, alternatives));
}

function getRankPlotTitles(alternatives: IAlternative[], legend: any) {
  return [
    ['x'].concat(
      _.map(alternatives, function (alternative) {
        return legend ? legend[alternative.id].newTitle : alternative.title;
      })
    )
  ];
}

function getRankPlotValues(
  ranks: Record<string, number[]>,
  alternatives: IAlternative[]
) {
  let values = _.map(alternatives, function (alternative, index) {
    return ['Rank ' + (index + 1)];
  });

  _.forEach(alternatives, function (alternative, index) {
    _.forEach(
      ranks[alternative.id],
      (rankResult: number[], key: number) =>
        (values[key][index + 1] = rankResult)
    );
  });

  return values;
}
