import ICriterion from '@shared/interface/ICriterion';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IPieceWiseLinearScenarioPvf from '@shared/interface/Scenario/IPieceWiseLinearScenarioPvf';
import {TScenarioPvf} from '@shared/interface/Scenario/TScenarioPvf';
import {TPreferences} from '@shared/types/Preferences';
import _ from 'lodash';

export function initPvfs(
  criteria: ICriterion[],
  currentScenario: IMcdaScenario,
  ranges: Record<string, [number, number]>,
  observedRanges: Record<string, [number, number]>
): Record<string, TPvf> {
  return _(criteria)
    .keyBy('id')
    .mapValues(_.partial(getPvf, currentScenario, ranges, observedRanges))
    .pickBy()
    .value();
}

function getPvf(
  currentScenario: IMcdaScenario,
  ranges: Record<string, [number, number]>,
  observedRanges: Record<string, [number, number]>,
  criterion: ICriterion
): TPvf | undefined {
  const scenarioPvf = getScenarioPvf(criterion.id, currentScenario);
  if (scenarioPvf) {
    const range = ranges[criterion.dataSources[0].id]
      ? ranges[criterion.dataSources[0].id]
      : observedRanges[criterion.dataSources[0].id];
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

function isPieceWiseLinearPvf(pvf: TPvf): pvf is IPieceWiseLinearPvf {
  return 'cutoffs' in pvf;
}

function getScenarioPvf(
  criterionId: string,
  currentScenario: IMcdaScenario
): TScenarioPvf | undefined {
  if (
    currentScenario.state.problem &&
    currentScenario.state.problem.criteria[criterionId] &&
    currentScenario.state.problem.criteria[criterionId].dataSources
  ) {
    return currentScenario.state.problem.criteria[criterionId].dataSources[0]
      .pvf;
  } else {
    return undefined;
  }
}

export function buildScenarioWithPreferences(
  scenario: IMcdaScenario,
  preferences: TPreferences
): IMcdaScenario {
  const newState = {
    ..._.omit(scenario.state, ['weights', 'prefs']),
    prefs: preferences
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
    }
  }
}

export function createScenarioWithPvf(
  criterionId: string,
  pvf: TPvf,
  currentScenario: IMcdaScenario
) {
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
