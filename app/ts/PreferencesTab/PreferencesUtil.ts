import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IScenario from '@shared/interface/Scenario/IScenario';
import IScenarioPvf from '@shared/interface/Scenario/IScenarioPvf';
import _ from 'lodash';

export function initPvfs(
  criteria: Record<string, IProblemCriterion>,
  currentScenario: IScenario
): Record<string, IPvf> {
  return _.mapValues(criteria, (criterion, id) => {
    const scenarioPvf = getScenarioPvf(id, currentScenario);
    return _.merge({}, criterion.dataSources[0].pvf, scenarioPvf);
  });
}

function getScenarioPvf(
  criterionId: string,
  currentScenario: IScenario
): IScenarioPvf {
  if (
    currentScenario.state.problem &&
    currentScenario.state.problem.criteria[criterionId] &&
    currentScenario.state.problem.criteria[criterionId].dataSources
  ) {
    return currentScenario.state.problem.criteria[criterionId].dataSources[0]
      .pvf;
  }
}

export function createPreferencesCriteria(
  criteria: Record<string, IProblemCriterion>
): Record<string, IPreferencesCriterion> {
  return _.mapValues(criteria, (criterion, id) => {
    const dataSource = criterion.dataSources[0];
    let preferencesCriterion = {
      ..._.pick(criterion, ['title', 'description', 'isFavorable']),
      id: id,
      dataSourceId: dataSource.id,
      ..._.pick(dataSource, ['unitOfMeasurement'])
    };
    return preferencesCriterion;
  });
}
