import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {IAbsolutePataviTableEntry} from '@shared/interface/Patavi/IAbsolutePataviTableEntry';
import {IPataviCriterion} from '@shared/interface/Patavi/IPataviCriterion';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IRelativePataviTableEntry} from '@shared/interface/Patavi/IRelativePataviTableEntry';
import IScalesCommand from '@shared/interface/Patavi/IScalesCommand';
import {TEffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import {
  IDistributionPerformance,
  IEffectPerformance,
  TPerformance
} from '@shared/interface/Problem/IPerformance';
import {IAbsolutePerformanceTableEntry} from '@shared/interface/Problem/IAbsolutePerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IPvf from '@shared/interface/Problem/IPvf';
import {IRelativePerformanceTableEntry} from '@shared/interface/Problem/IRelativePerformanceTableEntry';
import {TDistributionPerformance} from '@shared/interface/Problem/TDistributionPerformance';
import _ from 'lodash';
import {TPerformanceTableEntry} from '@shared/interface/Problem/TPerformanceTableEntry';
import {TPataviPerformanceTableEntry} from '@shared/interface/Patavi/TPataviPerfomanceTableEntry';

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
    performanceTable: buildPataviPerformanceTable(
      problem.performanceTable,
      filteredCriteria,
      filteredAlternatives
    ),
    alternatives: _.keyBy(filteredAlternatives, 'id'),
    criteria: _(filteredCriteria)
      .map(_.partial(buildPataviCriterion, pvfs))
      .keyBy('id')
      .value()
  };
}

function buildPataviCriterion(
  pvfs: Record<string, IPvf>,
  criterion: ICriterion
): IPataviCriterion {
  const dataSource = criterion.dataSources[0];
  const scale = getScale(dataSource.unitOfMeasurement);
  return {
    id: criterion.id,
    title: criterion.title,
    pvf: pvfs[criterion.id],
    scale: scale
  };
}

function getScale(unit: IUnitOfMeasurement): [number, number] {
  if (unit.type === 'percentage') {
    return [0, 1];
  } else {
    return [unit.lowerBound, unit.upperBound];
  }
}

export function buildPataviPerformanceTable(
  performanceTable: TPerformanceTableEntry[],
  criteria: ICriterion[],
  alternatives: IAlternative[]
): TPataviPerformanceTableEntry[] {
  const filteredPerformanceTable = filterIncludedEntries(
    performanceTable,
    criteria,
    alternatives
  );
  return _.map(
    filteredPerformanceTable,
    (entry: TPerformanceTableEntry): TPataviPerformanceTableEntry => {
      if (isAbsoluteEntry(entry)) {
        return buildAbsolutePataviEntry(entry);
      } else {
        return buildRelativePataviEntry(entry);
      }
    }
  );
}

function buildAbsolutePataviEntry(
  entry: IAbsolutePerformanceTableEntry
): IAbsolutePataviTableEntry {
  return {
    ...entry,
    performance: getPerformance(entry.performance)
  };
}

function buildRelativePataviEntry(
  entry: IRelativePerformanceTableEntry
): IRelativePataviTableEntry {
  return {
    ...entry,
    performance: entry.performance.distribution
  };
}

function filterIncludedEntries(
  performanceTable: TPerformanceTableEntry[],
  criteria: ICriterion[],
  alternatives: IAlternative[]
): TPerformanceTableEntry[] {
  const entriesFilteredByCriteria = filterEntriesByCriteria(
    criteria,
    performanceTable
  );
  return filterEntriesByAlternatives(alternatives, entriesFilteredByCriteria);
}

function filterEntriesByCriteria(
  criteria: ICriterion[],
  performanceTable: TPerformanceTableEntry[]
): TPerformanceTableEntry[] {
  return _.filter(
    performanceTable,
    (entry: IAbsolutePerformanceTableEntry): boolean =>
      _.some(
        criteria,
        (criterion) => entry.dataSource === criterion.dataSources[0].id
      )
  );
}

function filterEntriesByAlternatives(
  alternatives: IAlternative[],
  performanceTable: TPerformanceTableEntry[]
): TPerformanceTableEntry[] {
  return _.filter(
    performanceTable,
    (entry: IAbsolutePerformanceTableEntry): boolean =>
      !isAbsoluteEntry(entry) ||
      _.some(
        alternatives,
        (alternative) => entry.alternative === alternative.id
      )
  );
}

function isAbsoluteEntry(
  entry: TPerformanceTableEntry
): entry is IAbsolutePerformanceTableEntry {
  return entry.hasOwnProperty('alternative');
}

function getPerformance(
  performance: TPerformance
): TEffectPerformance | TDistributionPerformance {
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
  performance: TPerformance
): performance is IDistributionPerformance {
  return performance.hasOwnProperty('distribution');
}

function isEffectPerformance(
  performance: TPerformance
): performance is IEffectPerformance {
  return performance.hasOwnProperty('effect');
}

export function getScalesCommand(
  problem: IProblem,
  criteria: ICriterion[],
  alternatives: IAlternative[]
): IScalesCommand {
  return {
    schemaVersion: problem.schemaVersion,
    title: problem.title,
    description: problem.description,
    preferences: problem.preferences ? problem.preferences : undefined,
    performanceTable: buildScalesPerformanceTable(problem.performanceTable),
    alternatives: _.keyBy(alternatives, 'id'),
    criteria: buildPataviScalesCriteria(criteria),
    method: 'scales'
  };
}

function buildPataviScalesCriteria(
  criteria: ICriterion[]
): Record<string, IPataviCriterion> {
  return _(criteria)
    .flatMap('dataSources')
    .keyBy('id')
    .mapValues(buildPataviScalesCriterion)
    .value();
}

function buildPataviScalesCriterion(dataSource: IDataSource): IPataviCriterion {
  const scale = getScale(dataSource.unitOfMeasurement);
  return {
    title: undefined,
    id: dataSource.id,
    pvf: undefined,
    scale: scale
  };
}

export function buildScalesPerformanceTable(
  performanceTable: TPerformanceTableEntry[]
): TPataviPerformanceTableEntry[] {
  return _.map(
    performanceTable,
    (entry: TPerformanceTableEntry): TPataviPerformanceTableEntry => {
      if (isAbsoluteEntry(entry)) {
        return buildAbsolutePataviEntryForScales(entry);
      } else {
        return buildRelativePataviEntryForScales(entry);
      }
    }
  );
}

function buildAbsolutePataviEntryForScales(
  entry: IAbsolutePerformanceTableEntry
): IAbsolutePataviTableEntry {
  return {
    ...entry,
    performance: getPerformance(entry.performance),
    criterion: entry.dataSource
  };
}

function buildRelativePataviEntryForScales(
  entry: IRelativePerformanceTableEntry
): IRelativePataviTableEntry {
  return {
    ...entry,
    performance: entry.performance.distribution,
    criterion: entry.dataSource
  };
}
