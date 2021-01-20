import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {IPataviCriterion} from '@shared/interface/Patavi/IPataviCriterion';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IPataviTableEntry} from '@shared/interface/Patavi/IPataviTableEntry';
import {EffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import {
  IDistributionPerformance,
  IEffectPerformance,
  TPerformance
} from '@shared/interface/Problem/IPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import {TRelativePerformance} from '@shared/interface/Problem/IProblemRelativePerformance';
import IPvf from '@shared/interface/Problem/IPvf';
import {TDistributionPerformance} from '@shared/interface/Problem/TDistributionPerformance';
import _ from 'lodash';

export function getPataviProblem(
  problem: IProblem,
  filteredCriteria: ICriterion[],
  filteredAlternatives: IAlternative[],
  pvfs: Record<string, IPvf>
): IPataviProblem {
  return {
    schemaVersion: problem.schemaVersion,
    title: problem.title,
    description: problem.description,
    preferences: problem.preferences ? problem.preferences : undefined,
    performanceTable: buildPataviPerformanceTable(problem.performanceTable),
    alternatives: _.keyBy(filteredAlternatives, 'id'),
    criteria: _(filteredCriteria)
      .keyBy('id')
      .mapValues(_.partial(buildPataviCriterion, pvfs))
      .value()
  };
}

function buildPataviCriterion(
  pvfs: Record<string, IPvf>,
  criterion: ICriterion
): IPataviCriterion {
  const scale: [number, number] = [
    criterion.dataSources[0].unitOfMeasurement.lowerBound,
    criterion.dataSources[0].unitOfMeasurement.upperBound
  ];
  return {
    id: criterion.id,
    title: criterion.title,
    pvf: pvfs[criterion.id],
    scale: scale
  };
}

export function buildPataviPerformanceTable(
  performanceTable: IPerformanceTableEntry[]
): IPataviTableEntry[] {
  return _.map(performanceTable, (entry: IPerformanceTableEntry) => {
    return {...entry, performance: getPerformance(entry.performance)};
  });
}

function getPerformance(
  performance: TPerformance
): EffectPerformance | TDistributionPerformance | TRelativePerformance {
  if (
    isDistributionOrRelativePerformance(performance) &&
    performance.distribution.type !== 'empty'
  ) {
    return performance.distribution;
  } else if (isEffectPerformance(performance)) {
    return performance.effect;
  } else {
    throw 'Unrecognized performance';
  }
}

function isDistributionOrRelativePerformance(
  performance: TPerformance
): performance is IDistributionPerformance {
  return performance.hasOwnProperty('distribution');
}

function isEffectPerformance(
  performance: TPerformance
): performance is IEffectPerformance {
  return performance.hasOwnProperty('effect');
}
