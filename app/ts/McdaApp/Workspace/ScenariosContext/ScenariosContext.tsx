import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import {AxiosResponse, default as axios, default as Axios} from 'axios';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {useHistory, useParams} from 'react-router';
import {ErrorContext} from '../../../Error/ErrorContext';
import {CurrentSubproblemContext} from '../CurrentSubproblemContext/CurrentSubproblemContext';
import IScenariosContext from './IScenariosContext';
import {filterScenariosWithPvfs} from './preferencesUtil';

export const ScenariosContext = createContext<IScenariosContext>(
  {} as IScenariosContext
);

export function ScenariosContextProviderComponent({children}: {children: any}) {
  const history = useHistory();
  const {workspaceId, subproblemId} = useParams<{
    workspaceId: string;
    subproblemId: string;
  }>();

  const {setError} = useContext(ErrorContext);

  const {filteredCriteria} = useContext(CurrentSubproblemContext);

  const [scenarios, setScenarios] = useState<Record<string, IMcdaScenario>>();

  useEffect(() => {
    setScenarios({});
    axios
      .get(
        `/api/v2/workspaces/${workspaceId}/problems/${subproblemId}/scenarios`
      )
      .then((result: AxiosResponse<IMcdaScenario[]>) => {
        setScenarios(_.keyBy(result.data, 'id'));
      });
  }, [workspaceId, subproblemId]);

  function deleteScenario(scenarioId: string): void {
    Axios.delete(
      `/api/v2/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${scenarioId}`
    )
      .then(() => {
        const newScenarios: IMcdaScenario[] = _.reject(scenarios, [
          'id',
          scenarioId
        ]);

        history.push(
          `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${newScenarios[0].id}/preferences`
        );

        setScenarios(_.keyBy(newScenarios, 'id'));
      })
      .catch(setError);
  }

  function copyScenario(newTitle: string, scenarioToCopy: IMcdaScenario): void {
    const scenarioCommand: IScenarioCommand = {
      title: newTitle,
      state: scenarioToCopy.state,
      subproblemId: subproblemId,
      workspaceId: workspaceId
    };
    postScenario(scenarioCommand);
  }

  function addScenario(newTitle: string): void {
    const scenarioCommand: IScenarioCommand = {
      title: newTitle,
      state: {
        prefs: [],
        problem: {criteria: {}},
        thresholdValuesByCriterion: {}
      },
      subproblemId: subproblemId,
      workspaceId: workspaceId
    };
    postScenario(scenarioCommand);
  }

  function postScenario(command: IScenarioCommand): void {
    setScenarios({});

    Axios.post(
      `/api/v2/workspaces/${workspaceId}/problems/${subproblemId}/scenarios`,
      command
    )
      .then((result: AxiosResponse<{id: string}>) => {
        history.push(
          `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${result.data.id}/preferences`
        );
        updateScenarios({...command, id: result.data.id});
      })
      .catch(setError);
  }

  const updateScenarios = useCallback(
    (scenario: IMcdaScenario): void => {
      setScenarios({...scenarios, [scenario.id]: scenario});
    },
    [scenarios]
  );

  function getScenario(id: string): IMcdaScenario {
    return scenarios[id];
  }

  return (
    <ScenariosContext.Provider
      value={{
        scenarios: scenarios,
        scenariosWithPvfs: filterScenariosWithPvfs(scenarios, filteredCriteria),
        getScenario,
        updateScenarios,
        deleteScenario,
        copyScenario,
        addScenario
      }}
    >
      <LoadingSpinner showSpinnerCondition={_.isEmpty(scenarios)}>
        {children}
      </LoadingSpinner>
    </ScenariosContext.Provider>
  );
}
