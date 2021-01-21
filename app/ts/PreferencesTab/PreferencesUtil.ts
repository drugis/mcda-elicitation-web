import ICriterion from '@shared/interface/ICriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IScenarioPvf from '@shared/interface/Scenario/IScenarioPvf';
import {TPreferences} from '@shared/types/Preferences';
import _ from 'lodash';

export function initPvfs(
  criteria: ICriterion[],
  currentScenario: IMcdaScenario,
  ranges: Record<string, [number, number]>,
  observedRanges: Record<string, [number, number]>
): Record<string, IPvf> {
  return _(criteria)
    .keyBy('id')
    .mapValues((criterion) => {
      const scenarioPvf = getScenarioPvf(criterion.id, currentScenario);
      return _.merge(
        {},
        {
          range: ranges[criterion.dataSources[0].id]
            ? ranges[criterion.dataSources[0].id]
            : observedRanges[criterion.dataSources[0].id]
        },
        scenarioPvf
      );
    })
    .value();
}

function getScenarioPvf(
  criterionId: string,
  currentScenario: IMcdaScenario
): IScenarioPvf | undefined {
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
