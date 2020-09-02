import IScenario from '@shared/interface/Scenario/IScenario';
import React, {createContext, useState, useContext, useEffect} from 'react';
import IPreferencesContext from './IPreferencesContext';
import _, {values} from 'lodash';
import Axios, {AxiosResponse} from 'axios';
import {ErrorContext} from '../Error/ErrorContext';
import IError from '@shared/interface/IError';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
export const PreferencesContext = createContext<IPreferencesContext>(
  {} as IPreferencesContext
);

export function PreferencesContextProviderComponent({
  children,
  scenarios,
  workspaceId
}: {
  children: any;
  scenarios: IScenario[];
  workspaceId: string;
}) {
  const {setError} = useContext(ErrorContext);
  const [contextScenarios, setScenarios] = useState<Record<string, IScenario>>(
    _.keyBy(scenarios, 'id')
  );

  const [currentScenario, setCurrentScenario] = useState<IScenario>(
    scenarios[0] // TODO: take the one who's id is in the url instead
  );
  const subproblemId = currentScenario.subproblemId;

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
        setScenarios(newScenarios);
        if (id === currentScenario.id) {
          setCurrentScenario(_.values(newScenarios)[0]);
        }
      })
      .catch(errorCallback);
  }

  function copyScenario(newTitle: string) {
    const scenarioCommand: IScenarioCommand = {
      title: newTitle,
      state: _.cloneDeep(currentScenario.state),
      subproblemId: subproblemId
    };
    Axios.post(
      `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios`,
      scenarioCommand
    )
      .then((result: AxiosResponse) => {
        const newScenario: IScenario = {...scenarioCommand, id: result.data.id};
        setCurrentScenario(newScenario);
        let scenarioToAdd: Record<string, IScenario> = {};
        scenarioToAdd[result.data.id] = newScenario;
        setScenarios({...contextScenarios, ...scenarioToAdd});
      })
      .catch(errorCallback);
  }

  function newScenario(newTitle: string){
    const scenarioCommand: IScenarioCommand = {
      title: newTitle,
      state: {prefs:[],problem: {criteria: {}}},
      subproblemId: subproblemId
    };
     Axios.post(
      `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios`,
      scenarioCommand
    )
      .then((result: AxiosResponse) => {
        const newScenario: IScenario = {...scenarioCommand, id: result.data.id};
        setCurrentScenario(newScenario);
        let scenarioToAdd: Record<string, IScenario> = {};
        scenarioToAdd[result.data.id] = newScenario;
        setScenarios({...contextScenarios, ...scenarioToAdd});
      })
      .catch(errorCallback);
  }
  }

  function errorCallback(error: IError) {
    setError(error.message);
  }

  return (
    <PreferencesContext.Provider
      value={{
        scenarios: contextScenarios,
        currentScenario,
        setCurrentScenario,
        updateScenario,
        deleteScenario,
        copyScenario
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
