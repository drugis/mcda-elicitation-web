import IError from '@shared/interface/IError';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IScenario from '@shared/interface/Scenario/IScenario';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import IScenarioPvf from '@shared/interface/Scenario/IScenarioPvf';
import {TPvfDirection} from '@shared/types/PvfTypes';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useState} from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import getScenarioLocation from '../ScenarioSelection/getScenarioLocation';
import IPreferencesContext from './IPreferencesContext';
export const PreferencesContext = createContext<IPreferencesContext>(
  {} as IPreferencesContext
);

export function PreferencesContextProviderComponent({
  children,
  scenarios,
  currentScenarioId,
  workspaceId,
  problem
}: {
  children: any;
  scenarios: IScenario[];
  currentScenarioId: string;
  workspaceId: string;
  problem: IProblem;
}) {
  const {setError} = useContext(ErrorContext);
  const [contextScenarios, setScenarios] = useState<Record<string, IScenario>>(
    _.keyBy(scenarios, 'id')
  );

  const [currentScenario, setCurrentScenario] = useState<IScenario>(
    _.find(contextScenarios, ['id', currentScenarioId]) // TODO: take the one who's id is in the url instead
  );
  const criteria = createPreferencesCriteria(problem.criteria);
  const [pvfs, setPvfs] = useState<Record<string, IPvf>>(
    initPvfs(problem.criteria)
  );
  const subproblemId = currentScenario.subproblemId;

  function initPvfs(
    criteria: Record<string, IProblemCriterion>
  ): Record<string, IPvf> {
    return _.mapValues(criteria, (criterion, id) => {
      const scenarioPvf = getScenarioPvf(id);
      return _.merge({}, criterion.dataSources[0].pvf, scenarioPvf);
    });
  }

  function getScenarioPvf(criterionId: string): IScenarioPvf {
    const scenarioCriterion =
      currentScenario.state.problem.criteria[criterionId];
    if (scenarioCriterion && scenarioCriterion.dataSources) {
      return scenarioCriterion.dataSources[0].pvf;
    }
  }

  function getPvf(criterionId: string): IPvf {
    return pvfs[criterionId];
  }

  function createPreferencesCriteria(
    criteria: Record<string, IProblemCriterion>
  ): Record<string, IPreferencesCriterion> {
    return _.mapValues(criteria, (criterion, id) => {
      const dataSource = criterion.dataSources[0];
      let preferencesCriterion = {
        ..._.pick(criterion, ['title', 'description', 'isFavorable']),
        id: id,
        dataSourceId: dataSource.id,
        ..._.pick(dataSource, ['unitOfMeasurement', 'scale'])
      };
      return preferencesCriterion;
    });
  }

  function setLinearPvf(criterionId: string, direction: TPvfDirection): void {
    const pvf: IPvf = {
      direction: direction,
      type: 'linear',
      range: pvfs[criterionId].range
    };
    let newPvfs = _.cloneDeep(pvfs);
    newPvfs[criterionId] = pvf;
    setPvfs(newPvfs);
    let newScenario = _.cloneDeep(currentScenario);
    newScenario.state.problem.criteria[criterionId] = {
      dataSources: [{pvf}]
    };
    updateScenario(newScenario);
  }

  function updateScenario(newScenario: IScenario): void {
    let scenarioToAdd: Record<string, IScenario> = {};
    scenarioToAdd[newScenario.id] = newScenario;
    Axios.post(
      `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${newScenario.id}`,
      newScenario
    )
      .then(() => {
        setScenarios({...contextScenarios, ...scenarioToAdd});
        setCurrentScenario(newScenario);
      })
      .catch(errorCallback);
  }

  function deleteScenario(id: string): void {
    Axios.delete(
      `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${id}`
    )
      .then(() => {
        let newScenarios = _.cloneDeep(contextScenarios);
        delete newScenarios[id];
        window.location.assign(
          getScenarioLocation(_.values(newScenarios)[0].id)
        );
      })
      .catch(errorCallback);
  }

  function copyScenario(newTitle: string): void {
    const scenarioCommand: IScenarioCommand = {
      title: newTitle,
      state: _.cloneDeep(currentScenario.state),
      subproblemId: subproblemId,
      workspaceId: workspaceId
    };
    postScenario(scenarioCommand);
  }

  function addScenario(newTitle: string): void {
    const scenarioCommand: IScenarioCommand = {
      title: newTitle,
      state: {prefs: [], problem: {criteria: {}}},
      subproblemId: subproblemId,
      workspaceId: workspaceId
    };
    postScenario(scenarioCommand);
  }

  function postScenario(command: IScenarioCommand): void {
    Axios.post(
      `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios`,
      command
    )
      .then((result: AxiosResponse) => {
        window.location.assign(getScenarioLocation(result.data.id));
      })
      .catch(errorCallback);
  }

  function errorCallback(error: IError) {
    setError(error.message);
  }

  function getCriterion(id: string): IProblemCriterion {
    return problem.criteria[id];
  }

  return (
    <PreferencesContext.Provider
      value={{
        scenarios: contextScenarios,
        currentScenario,
        problem,
        pvfs,
        criteria,
        setCurrentScenario,
        updateScenario,
        deleteScenario,
        copyScenario,
        addScenario,
        getCriterion,
        getPvf,
        setLinearPvf
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
