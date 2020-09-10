import IError from '@shared/interface/IError';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IScenario from '@shared/interface/Scenario/IScenario';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import {TPvfDirection} from '@shared/types/PvfTypes';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useState} from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import getScenarioLocation from '../ScenarioSelection/getScenarioLocation';
import IPreferencesContext from './IPreferencesContext';
import {createPreferencesCriteria, initPvfs} from './PreferencesUtil';
import IWorkspaceSettings from '@shared/interface/IWorkspaceSettings';

export const PreferencesContext = createContext<IPreferencesContext>(
  {} as IPreferencesContext
);

export function PreferencesContextProviderComponent({
  children,
  scenarios,
  currentScenarioId,
  workspaceId,
  problem,
  settings
}: {
  children: any;
  scenarios: IScenario[];
  currentScenarioId: string;
  workspaceId: string;
  problem: IProblem;
  settings: IWorkspaceSettings;
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
    initPvfs(problem.criteria, currentScenario)
  );
  const subproblemId = currentScenario.subproblemId;

  function getPvf(criterionId: string): IPvf {
    return pvfs[criterionId];
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
    let newScenario: IScenario = _.cloneDeep(currentScenario);
    newScenario.state.problem.criteria[criterionId] = {
      dataSources: [{pvf: {direction: direction, type: 'linear'}}]
    };
    updateScenario(newScenario);
    if (areAllPvfsSet()) {
      getWeights();
    }
  }

  function getWeights() {
    const postProblem = {
      ..._.cloneDeep(problem),
      method: 'representativeWeights',
      seed: settings.randomSeed
    };
    Axios.post('/patavi/weights', postProblem);
  }

  function areAllPvfsSet() {
    return !_.every(pvfs, (pvf) => {
      return !!pvf.direction;
    });
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
