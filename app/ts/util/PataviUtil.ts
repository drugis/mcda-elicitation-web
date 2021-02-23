import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import IWorkspace from '@shared/interface/IWorkspace';
import {IAbsolutePataviTableEntry} from '@shared/interface/Patavi/IAbsolutePataviTableEntry';
import {IPataviCriterion} from '@shared/interface/Patavi/IPataviCriterion';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IRelativePataviTableEntry} from '@shared/interface/Patavi/IRelativePataviTableEntry';
import IScalesCommand from '@shared/interface/Patavi/IScalesCommand';
import {
  IWeightsCommand,
  IWeightsProblem
} from '@shared/interface/Patavi/IWeightsCommand';
import {TPataviPerformanceTableEntry} from '@shared/interface/Patavi/TPataviPerfomanceTableEntry';
import {IAbsolutePerformanceTableEntry} from '@shared/interface/Problem/IAbsolutePerformanceTableEntry';
import {TEffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import {
  IDistributionPerformance,
  IEffectPerformance,
  TPerformance
} from '@shared/interface/Problem/IPerformance';
import IProblem from '@shared/interface/Problem/IProblem';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {IRelativePerformanceTableEntry} from '@shared/interface/Problem/IRelativePerformanceTableEntry';
import {TDistributionPerformance} from '@shared/interface/Problem/TDistributionPerformance';
import {TPerformanceTableEntry} from '@shared/interface/Problem/TPerformanceTableEntry';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPreferences} from '@shared/types/Preferences';
import {isAbsoluteEntry} from '@shared/workspaceService';
import _ from 'lodash';

type EntriesRecord = Record<string, Record<string, IAbsolutePataviTableEntry>>;

export function getWeightsPataviProblem(
  workspace: IWorkspace,
  scenario: IMcdaScenario,
  pvfs: Record<string, TPvf>,
  randomSeed: number
): IWeightsCommand {
  const pataviProblem: IWeightsProblem = {
    preferences: scenario.state.prefs,
    alternatives: _.keyBy(workspace.alternatives, 'id'),
    criteria: _(workspace.criteria)
      .map(_.partial(buildPataviCriterion, pvfs))
      .keyBy('id')
      .value(),
    method: 'representativeWeights',
    seed: randomSeed
  };
  return {
    problem: pataviProblem,
    scenario: scenario
  };
}

export function getPataviProblem(
  workspace: IWorkspace,
  preferences: TPreferences,
  pvfs: Record<string, TPvf>
): IPataviProblem {
  return {
    preferences: preferences,
    performanceTable: buildPataviPerformanceTable(workspace),
    alternatives: _.keyBy(workspace.alternatives, 'id'),
    criteria: _(workspace.criteria)
      .map(_.partial(buildPataviCriterion, pvfs))
      .keyBy('id')
      .value()
  };
}

function buildPataviCriterion(
  pvfs: Record<string, TPvf>,
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
  workspace: IWorkspace
): TPataviPerformanceTableEntry[] {
  const effectEntries = buildPataviTableEntries(
    workspace.effects,
    getEffectPerformance,
    {}
  );
  const combinedEntries = buildPataviTableEntries(
    workspace.distributions,
    getDistributionPerformance,
    effectEntries
  );
  const combinedEntriesFlattened: TPataviPerformanceTableEntry[] = _(
    combinedEntries
  )
    .values()
    .flatMap(_.values)
    .value();
  const relativeEntries = _.map(
    workspace.relativePerformances,
    buildRelativePataviEntry
  );
  return [...combinedEntriesFlattened, ...relativeEntries];
}

function buildPataviTableEntries(
  sourceEntries: (Effect | Distribution)[],
  fn: (effect: Effect | Distribution) => IAbsolutePataviTableEntry,
  initialValues: EntriesRecord
): EntriesRecord {
  return _.reduce(
    sourceEntries,
    (accum: EntriesRecord, entry: Effect): EntriesRecord => {
      return {
        ...accum,
        [entry.criterionId]: {
          ...accum[entry.criterionId],
          [entry.alternativeId]: fn(entry)
        }
      };
    },
    initialValues
  );
}

function getEffectPerformance(effect: Effect): IAbsolutePataviTableEntry {
  const base = {
    alternative: effect.alternativeId,
    criterion: effect.criterionId,
    dataSource: effect.dataSourceId
  };
  if (effect.type === 'value' || effect.type === 'valueCI') {
    return {
      ...base,
      performance: {
        type: 'exact',
        value: effect.value
      }
    };
  } else if (effect.type === 'range') {
    return {
      ...base,
      performance: {
        type: 'exact',
        value: (effect.lowerBound + effect.upperBound) / 2
      }
    };
  } else {
    throw 'Attempt to create invalid performance table entry for Patavi';
  }
}

function getDistributionPerformance(
  distribution: Distribution
): IAbsolutePataviTableEntry {
  const base = {
    alternative: distribution.alternativeId,
    criterion: distribution.criterionId,
    dataSource: distribution.dataSourceId
  };
  if (distribution.type === 'value') {
    return {
      ...base,
      performance: {
        type: 'exact',
        value: distribution.value
      }
    };
  } else if (distribution.type === 'range') {
    return {
      ...base,
      performance: {
        type: 'range',
        parameters: {
          lowerBound: distribution.lowerBound,
          upperBound: distribution.upperBound
        }
      }
    };
  } else if (distribution.type === 'normal') {
    return {
      ...base,
      performance: {
        type: 'dnorm',
        parameters: {
          mu: distribution.mean,
          sigma: distribution.standardError
        }
      }
    };
  } else if (distribution.type === 'beta') {
    return {
      ...base,
      performance: {
        type: 'dbeta',
        parameters: {
          alpha: distribution.alpha,
          beta: distribution.beta
        }
      }
    };
  } else if (distribution.type === 'gamma') {
    return {
      ...base,
      performance: {
        type: 'dgamma',
        parameters: {
          alpha: distribution.alpha,
          beta: distribution.beta
        }
      }
    };
  } else if (distribution.type === 'dt') {
    return {
      ...base,
      performance: {
        type: 'dt',
        parameters: {
          mu: distribution.mean,
          dof: distribution.dof,
          stdErr: distribution.standardError
        }
      }
    };
  } else if (distribution.type === 'survival') {
    return {
      ...base,
      performance: {
        type: 'dsurv',
        parameters: {
          alpha: distribution.alpha,
          beta: distribution.beta,
          summaryMeasure: distribution.summaryMeasure,
          time: distribution.time
        }
      }
    };
  } else {
    throw 'Attempt to create invalid performance table entry for Patavi';
  }
}

function buildRelativePataviEntry(
  performance: IRelativePerformance
): IRelativePataviTableEntry {
  return {
    criterion: performance.criterionId,
    dataSource: performance.dataSourceId,
    performance: {
      parameters: {
        baseline: performance.baseline,
        relative: performance.relative
      },
      type: performance.type
    }
  };
}

export function getScalesCommand(
  problem: IProblem,
  criteria: ICriterion[],
  alternatives: IAlternative[]
): IScalesCommand {
  return {
    preferences: undefined,
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

function buildScalesPerformanceTable(
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

function buildRelativePataviEntryForScales(
  entry: IRelativePerformanceTableEntry
): IRelativePataviTableEntry {
  return {
    ...entry,
    performance: entry.performance.distribution,
    criterion: entry.dataSource
  };
}
