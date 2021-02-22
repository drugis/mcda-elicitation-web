import ICriterion from '@shared/interface/ICriterion';
import {OurError} from '@shared/interface/IError';
import IWeights from '@shared/interface/IWeights';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import {TPreferences} from '@shared/types/Preferences';
import {TPvfDirection} from '@shared/types/PvfTypes';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import getScenarioLocation from '../ScenarioSelection/getScenarioLocation';
import {SettingsContext} from '../Settings/SettingsContext';
import {getWeightsPataviProblem} from '../util/PataviUtil';
import {SubproblemContext} from '../Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContext} from '../Workspace/WorkspaceContext';
import IPreferencesContext from './IPreferencesContext';
import {
  determineElicitationMethod,
  filterScenariosWithPvfs,
  initPvfs
} from './PreferencesUtil';
import {TPreferencesView} from './TPreferencesView';

export const PreferencesContext = createContext<IPreferencesContext>(
  {} as IPreferencesContext
);

export function PreferencesContextProviderComponent({
  children,
  scenarios,
  currentScenarioId,
  workspaceId,
  updateAngularScenario
}: {
  children: any;
  scenarios: IMcdaScenario[];
  currentScenarioId: string;
  workspaceId: string;
  updateAngularScenario: (scenario: IMcdaScenario) => void;
}) {
  const {setError} = useContext(ErrorContext);
  const {
    settings: {randomSeed}
  } = useContext(SettingsContext);
  const {currentSubproblem} = useContext(WorkspaceContext);
  const {filteredCriteria, observedRanges, filteredWorkspace} = useContext(
    SubproblemContext
  );

  const [contextScenarios, setScenarios] = useState<
    Record<string, IMcdaScenario>
  >(_.keyBy(scenarios, 'id'));

  const [currentScenario, setCurrentScenario] = useState<IMcdaScenario>(
    _.find(contextScenarios, ['id', currentScenarioId]) // FIXME: take the one who's id is in the url instead
  );
  const [pvfs, setPvfs] = useState<Record<string, TPvf>>();
  const subproblemId = currentScenario.subproblemId;
  const disableWeightsButtons = !areAllPvfsSet(pvfs);
  const [activeView, setActiveView] = useState<TPreferencesView>('preferences');
  const [elicitationMethod, setElicitationMethod] = useState<string>(
    determineElicitationMethod(currentScenario.state.prefs)
  );
  const [
    advancedPvfCriterionId,
    setAdvancedPvfCriterionId
  ] = useState<string>();

  useEffect(() => {
    if (!_.isEmpty(observedRanges)) {
      setPvfs(
        initPvfs(
          filteredCriteria,
          currentScenario,
          currentSubproblem.definition.ranges,
          observedRanges
        )
      );
    }
  }, [observedRanges]);

  useEffect(() => {
    if (areAllPvfsSet(pvfs) && !currentScenario.state.weights) {
      getWeights(currentScenario);
    }
    setElicitationMethod(
      determineElicitationMethod(currentScenario.state.prefs)
    );
  }, [currentScenario, pvfs]);

  function getPvf(criterionId: string): TPvf {
    return pvfs[criterionId];
  }

  function setLinearPvf(criterionId: string, direction: TPvfDirection): void {
    const pvf: ILinearPvf = {
      direction: direction,
      type: 'linear',
      range: pvfs[criterionId].range
    };
    const newPvfs = {..._.cloneDeep(pvfs), [criterionId]: pvf};
    setPvfs(newPvfs);
    const newScenario = createScenarioWithPvf(criterionId, direction);
    updateScenario(newScenario).then(() => {
      if (areAllPvfsSet(newPvfs)) {
        resetPreferences(newScenario);
      }
    });
  }

  function areAllPvfsSet(newPvfs: Record<string, TPvf>): boolean {
    return (
      newPvfs &&
      _.every(filteredCriteria, (criterion: ICriterion): boolean => {
        return (
          !!newPvfs[criterion.id].direction && !!newPvfs[criterion.id].type
        );
      })
    );
  }

  function createScenarioWithPvf(
    criterionId: string,
    direction: TPvfDirection
  ) {
    let newScenario: IMcdaScenario = _.cloneDeep(currentScenario);
    if (!newScenario.state.problem) {
      newScenario.state.problem = {criteria: {}};
    }
    newScenario.state.problem.criteria[criterionId] = {
      dataSources: [{pvf: {direction: direction, type: 'linear'}}]
    };
    return newScenario;
  }

  function resetPreferences(scenario: IMcdaScenario) {
    const newScenario = {
      ...scenario,
      state: {
        ..._.pick(scenario.state, ['problem', 'legend', 'uncertaintyOptions']),
        prefs: [] as TPreferences
      }
    };
    getWeights(newScenario);
  }

  function getWeights(scenario: IMcdaScenario) {
    const postCommand = getWeightsPataviProblem(
      filteredWorkspace,
      scenario,
      pvfs,
      randomSeed
    );
    Axios.post('/patavi/weights', postCommand).then(
      (result: AxiosResponse<IWeights>) => {
        const updatedScenario = _.merge({}, scenario, {
          state: {weights: result.data}
        });
        updateScenarioCallback(updatedScenario);
      }
    );
  }

  function updateScenario(newScenario: IMcdaScenario): Promise<void> {
    return Axios.post(
      `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${newScenario.id}`,
      newScenario
    )
      .then(_.partial(updateScenarioCallback, newScenario))
      .catch(errorCallback);
  }

  function updateScenarioCallback(scenario: IMcdaScenario) {
    setScenarios({..._.cloneDeep(contextScenarios), [scenario.id]: scenario});
    setCurrentScenario(scenario);
    if (areAllPvfsSet(pvfs)) {
      updateAngularScenario(scenario);
    }
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

  function errorCallback(error: OurError) {
    setError(error);
  }

  function goToAdvancedPvf(criterionId: string): void {
    setAdvancedPvfCriterionId(criterionId);
    setActiveView('advancedPvf');
  }

  return (
    <PreferencesContext.Provider
      value={{
        advancedPvfCriterionId,
        scenarios: contextScenarios,
        scenariosWithPvfs: filterScenariosWithPvfs(
          contextScenarios,
          filteredCriteria
        ),
        currentScenario,
        pvfs,
        disableWeightsButtons,
        activeView,
        elicitationMethod,
        setCurrentScenario,
        updateScenario,
        deleteScenario,
        copyScenario,
        addScenario,
        getPvf,
        goToAdvancedPvf,
        setLinearPvf,
        resetPreferences,
        setActiveView
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
