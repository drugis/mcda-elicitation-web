import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/IWeights';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IPieceWiseLinearScenarioPvf from '@shared/interface/Scenario/IPieceWiseLinearScenarioPvf';
import IRanking from '@shared/interface/Scenario/IRanking';
import IScenarioState from '@shared/interface/Scenario/IScenarioState';
import {TScenarioPvf} from '@shared/interface/Scenario/TScenarioPvf';
import {TPreferences} from '@shared/types/preferences';
import _ from 'lodash';
import {TPreferencesView} from './TPreferencesView';

export function initPvfs(
  criteria: ICriterion[],
  currentScenario: IMcdaScenario,
  configuredRanges: Record<string, [number, number]>
): Record<string, TPvf> {
  return _(criteria)
    .keyBy('id')
    .mapValues(_.partial(getPvf, currentScenario, configuredRanges))
    .pickBy()
    .value();
}

function getPvf(
  currentScenario: IMcdaScenario,
  configuredRanges: Record<string, [number, number]>,
  criterion: ICriterion
): TPvf | undefined {
  const scenarioPvf = getScenarioPvf(criterion.id, currentScenario);
  if (scenarioPvf) {
    const range = configuredRanges[criterion.dataSources[0].id];
    return _.merge({}, getPvfWithRange(scenarioPvf, range));
  } else {
    return undefined;
  }
}

function getPvfWithRange(
  scenarioPvf: TScenarioPvf,
  range: [number, number]
): TPvf {
  if (isPieceWiseLinearScenarioPvf(scenarioPvf)) {
    return {
      direction: scenarioPvf.direction,
      cutoffs: scenarioPvf.cutoffs,
      values: scenarioPvf.values,
      type: 'piecewise-linear',
      range: range
    };
  } else {
    return {
      direction: scenarioPvf.direction,
      type: 'linear',
      range: range
    };
  }
}

function isPieceWiseLinearScenarioPvf(
  pvf: TScenarioPvf
): pvf is IPieceWiseLinearScenarioPvf {
  return 'cutoffs' in pvf;
}

export function isPieceWiseLinearPvf(pvf: TPvf): pvf is IPieceWiseLinearPvf {
  return 'cutoffs' in pvf;
}

function getScenarioPvf(
  criterionId: string,
  currentScenario: IMcdaScenario
): TScenarioPvf | undefined {
  return currentScenario.state.problem.criteria[criterionId]?.dataSources?.[0]
    ?.pvf;
}

export function buildScenarioWithPreferences(
  scenario: IMcdaScenario,
  preferences: TPreferences,
  thresholdValuesByCriterion: Record<string, number>
): IMcdaScenario {
  const newState: IScenarioState = {
    ..._.omit(scenario.state, [
      'weights',
      'prefs',
      'thresholdValuesByCriterion'
    ]),
    prefs: preferences,
    thresholdValuesByCriterion: _.isEmpty(thresholdValuesByCriterion)
      ? {}
      : thresholdValuesByCriterion
  };
  return {..._.omit(scenario, ['state']), state: newState};
}

export function filterScenariosWithPvfs(
  scenarios: Record<string, IMcdaScenario>,
  criteria: ICriterion[]
): Record<string, IMcdaScenario> {
  return _.omitBy(scenarios, (scenario: IMcdaScenario) => {
    return _.some(criteria, (criterion: ICriterion) => {
      const scenarioCriterion = scenario.state.problem.criteria[criterion.id];
      return (
        !scenarioCriterion ||
        !scenarioCriterion.dataSources ||
        !scenarioCriterion.dataSources[0].pvf.direction
      );
    });
  });
}

export function determineElicitationMethod(preferences: TPreferences): string {
  if (!preferences.length) {
    return 'None';
  } else {
    switch (preferences[0].elicitationMethod) {
      case 'ranking':
        return 'Ranking';
      case 'precise':
        return 'Precise Swing Weighting';
      case 'matching':
        return 'Matching';
      case 'imprecise':
        return 'Imprecise Swing Weighting';
      case 'threshold':
        return 'Threshold';
    }
  }
}

export function createScenarioWithPvf(
  criterionId: string,
  pvf: TPvf,
  currentScenario: IMcdaScenario
): IMcdaScenario {
  let newScenario: IMcdaScenario = _.cloneDeep(currentScenario);
  if (!newScenario.state.problem) {
    newScenario.state.problem = {criteria: {}};
  }
  if (isPieceWiseLinearPvf(pvf)) {
    newScenario.state.problem.criteria[criterionId] = {
      dataSources: [
        {
          pvf: {
            direction: pvf.direction,
            cutoffs: pvf.cutoffs,
            values: pvf.values,
            type: 'piecewise-linear'
          }
        }
      ]
    };
  } else {
    newScenario.state.problem.criteria[criterionId] = {
      dataSources: [{pvf: {direction: pvf.direction, type: 'linear'}}]
    };
  }

  return newScenario;
}

export function areAllPvfsSet(
  criteria: ICriterion[],
  pvfs: Record<string, TPvf>
): boolean {
  return (
    pvfs &&
    _.every(
      criteria,
      (criterion: ICriterion): boolean =>
        pvfs[criterion.id] &&
        'direction' in pvfs[criterion.id] &&
        'type' in pvfs[criterion.id]
    )
  );
}

export function isElicitationView(activeView: TPreferencesView): boolean {
  return (
    activeView === 'precise' ||
    activeView === 'imprecise' ||
    activeView === 'matching' ||
    activeView === 'ranking' ||
    activeView === 'threshold'
  );
}

export function hasNonLinearPvf(pvfs: Record<string, TPvf>): boolean {
  return (
    _.some(pvfs, ['type', 'piecewise-linear']) ||
    _.some(pvfs, ['type', 'piece-wise-linear']) // FIXME: refactor into single correct type (piecewise-linear)
  );
}

export function calculateWeightsFromPreferences(
  criteria: ICriterion[],
  preferences: TPreferences
): IWeights {
  const criteriaById = _.keyBy(criteria, 'id');
  const numberOfCriteria = criteria.length;
  if (_.isEmpty(preferences)) {
    const equalWeight = 1 / numberOfCriteria;
    const weights = _.mapValues(criteriaById, () => equalWeight);
    return {'2.5%': weights, mean: weights, '97.5%': weights};
  } else if (isRankingPreferences(preferences)) {
    return getRankingWeights(preferences, numberOfCriteria);
  } else if (isExactPreferences(preferences)) {
    return getExactWeights(preferences);
  } else {
    throw 'Cannot calculate weights from set preferences';
  }
}
function isRankingPreferences(
  preferences: TPreferences
): preferences is IRanking[] {
  return preferences[0].elicitationMethod === 'ranking';
}

function isExactPreferences(
  preferences: TPreferences
): preferences is IExactSwingRatio[] {
  return preferences[0].type === 'exact swing';
}

function getRankingWeights(preferences: IRanking[], numberOfCriteria: number) {
  const rankByCriterionId = _.reduce(
    preferences.slice(1),
    (
      accum: Record<string, number>,
      preference: IRanking,
      index: number
    ): Record<string, number> => {
      accum[preference.criteria[1]] = index + 3;
      return accum;
    },
    {
      [preferences[0].criteria[0]]: 1,
      [preferences[0].criteria[1]]: 2
    }
  );
  const weights = _.mapValues(
    rankByCriterionId,
    (rank) =>
      (numberOfCriteria - rank + 1) /
      ((numberOfCriteria * (numberOfCriteria + 1)) / 2)
  );
  return {'2.5%': weights, mean: weights, '97.5%': weights};
}

function getExactWeights(preferences: IExactSwingRatio[]) {
  const totalRatio = _.reduce(
    preferences,
    (accum, preference) => {
      return accum + preference.ratio;
    },
    1 // most important criterion is not in the list, has ratio of 1 to itself
  );

  const weights: Record<string, number> = _.reduce(
    preferences,
    (
      accum: Record<string, number>,
      preference: IExactSwingRatio
    ): Record<string, number> => {
      accum[preference.criteria[1]] = preference.ratio / totalRatio;
      return accum;
    },
    {
      [preferences[0].criteria[0]]: 1 / totalRatio
    }
  );
  return {'2.5%': weights, mean: weights, '97.5%': weights};
}
