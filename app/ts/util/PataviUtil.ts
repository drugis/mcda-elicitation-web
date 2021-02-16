import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {IAbsolutePataviTableEntry} from '@shared/interface/Patavi/IAbsolutePataviTableEntry';
import {IPataviCriterion} from '@shared/interface/Patavi/IPataviCriterion';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IRelativePataviTableEntry} from '@shared/interface/Patavi/IRelativePataviTableEntry';
import IScalesCommand from '@shared/interface/Patavi/IScalesCommand';
import {EffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import {
  IDistributionPerformance,
  IEffectPerformance,
  TPerformance
} from '@shared/interface/Problem/IPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IPvf from '@shared/interface/Problem/IPvf';
import {IRelativePerformanceTableEntry} from '@shared/interface/Problem/IRelativePerformanceTableEntry';
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
  performanceTable: (IRelativePerformanceTableEntry | IPerformanceTableEntry)[],
  criteria: ICriterion[],
  alternatives: IAlternative[]
): (IRelativePataviTableEntry | IAbsolutePataviTableEntry)[] {
  const filteredPerformanceTable = filterIncludedEntries(
    performanceTable,
    criteria,
    alternatives
  );
  return _.map(
    filteredPerformanceTable,
    (
      entry: IPerformanceTableEntry | IRelativePerformanceTableEntry
    ): IAbsolutePataviTableEntry | IRelativePataviTableEntry => {
      if (isAbsoluteEntry(entry)) {
        return buildAbsolutePataviEntry(entry);
      } else {
        return buildRelativePataviEntry(entry);
      }
    }
  );
}

function buildAbsolutePataviEntry(
  entry: IPerformanceTableEntry
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
  performanceTable: (IRelativePerformanceTableEntry | IPerformanceTableEntry)[],
  criteria: ICriterion[],
  alternatives: IAlternative[]
): (IRelativePerformanceTableEntry | IPerformanceTableEntry)[] {
  const entriesFilteredByCriteria = _.filter(
    performanceTable,
    (entry: IPerformanceTableEntry): boolean =>
      _.some(
        criteria,
        (criterion) => entry.dataSource === criterion.dataSources[0].id
      )
  );
  return _.filter(
    entriesFilteredByCriteria,
    (entry: IPerformanceTableEntry): boolean =>
      !isAbsoluteEntry(entry) ||
      _.some(
        alternatives,
        (alternative) => entry.alternative === alternative.id
      )
  );
}

function isAbsoluteEntry(
  entry: IRelativePerformanceTableEntry | IPerformanceTableEntry
): entry is IPerformanceTableEntry {
  return entry.hasOwnProperty('alternative');
}

function getPerformance(
  performance: TPerformance
): EffectPerformance | TDistributionPerformance {
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
    criteria: _(criteria)
      .flatMap('dataSources')
      .keyBy('id')
      .mapValues(buildPataviScalesCriterion)
      .value(),
    method: 'scales'
  };
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
  performanceTable: (IRelativePerformanceTableEntry | IPerformanceTableEntry)[]
): (IRelativePataviTableEntry | IAbsolutePataviTableEntry)[] {
  return _.map(
    performanceTable,
    (
      entry: IPerformanceTableEntry | IRelativePerformanceTableEntry
    ): IRelativePataviTableEntry | IAbsolutePataviTableEntry => {
      if (isAbsoluteEntry(entry)) {
        return buildAbsolutePataviEntryForScales(entry);
      } else {
        return buildRelativePataviEntryForScales(entry);
      }
    }
  );
}

function buildAbsolutePataviEntryForScales(
  entry: IPerformanceTableEntry
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
