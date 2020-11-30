import ICriterion from '@shared/interface/ICriterion';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IScenarioPvf from '@shared/interface/Scenario/IScenarioPvf';
import {TPreferences} from '@shared/types/Preferences';
import _ from 'lodash';

export function initPvfs(
  criteria: ICriterion[],
  currentScenario: IMcdaScenario,
  ranges: Record<string, [number, number]>,
  problemCriteria: Record<string, IProblemCriterion>
): Record<string, IPvf> {
  return _(criteria)
    .keyBy('id')
    .mapValues((criterion) => {
      const scenarioPvf = getScenarioPvf(criterion.id, currentScenario);
      const problemPvf = getProblemPvf(criterion.id, problemCriteria);
      return _.merge(
        {},
        problemPvf,
        {range: ranges[criterion.dataSources[0].id]},
        scenarioPvf
      );
    })
    .value();
}

function getProblemPvf(
  criterionId: string,
  problemCriteria: Record<string, IProblemCriterion>
): IPvf | undefined {
  if (
    problemCriteria[criterionId] &&
    problemCriteria[criterionId].dataSources[0].pvf
  ) {
    return problemCriteria[criterionId].dataSources[0].pvf;
  } else {
    return undefined;
  }
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
