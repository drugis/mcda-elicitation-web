import IError from '@shared/interface/IError';
import IWeights from '@shared/interface/IWeights';
import IWorkspaceSettings from '@shared/interface/IWorkspaceSettings';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IScenario from '@shared/interface/Scenario/IScenario';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import {TPreferences} from '@shared/types/Preferences';
import {TPvfDirection} from '@shared/types/PvfTypes';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import getScenarioLocation from '../ScenarioSelection/getScenarioLocation';
import IPreferencesContext from './IPreferencesContext';
import {createPreferencesCriteria, initPvfs} from './PreferencesUtil';
import {TPreferencesView} from './TPreferencesView';

export const PreferencesContext = createContext<IPreferencesContext>(
  {} as IPreferencesContext
);

export function PreferencesContextProviderComponent({
  children,
  scenarios,
  currentScenarioId,
  workspaceId,
  problem,
  settings,
  updateAngularScenario
}: {
  children: any;
  scenarios: IScenario[];
  currentScenarioId: string;
  workspaceId: string;
  problem: IProblem;
  settings: IWorkspaceSettings;
  updateAngularScenario: (scenario: IScenario) => void;
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
  const disableWeightsButtons = !areAllPvfsSet(pvfs);
  const [activeView, setActiveView] = useState<TPreferencesView>('preferences');

  useEffect(() => {
    if (areAllPvfsSet(pvfs) && !currentScenario.state.weights) {
      getWeights(currentScenario);
    }
  }, [currentScenario, pvfs]);

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
    const newScenario = createScenarioWithPvf(criterionId, direction);
    updateScenario(newScenario).then(() => {
      if (areAllPvfsSet(newPvfs)) {
        resetPreferences(newScenario);
      }
    });
  }

  function areAllPvfsSet(newPvfs: Record<string, IPvf>): boolean {
    return _.every(newPvfs, (pvf) => {
      return !!pvf.direction && !!pvf.type;
    });
  }

  function createScenarioWithPvf(
    criterionId: string,
    direction: TPvfDirection
  ) {
    let newScenario: IScenario = _.cloneDeep(currentScenario);
    if (!newScenario.state.problem) {
      newScenario.state.problem = {criteria: {}};
    }
    newScenario.state.problem.criteria[criterionId] = {
      dataSources: [{pvf: {direction: direction, type: 'linear'}}]
    };
    return newScenario;
  }

  function resetPreferences(scenario: IScenario) {
    const newScenario = {
      ...scenario,
      state: {
        ..._.pick(scenario.state, ['problem', 'legend', 'uncertaintyOptions']),
        prefs: [] as TPreferences
      }
    };
    getWeights(newScenario);
  }

  function getWeights(scenario: IScenario) {
    const postProblem = _.merge(
      {},
      _.omit(problem, 'preferences'),
      scenario.state.problem,
      {
        preferences: scenario.state.prefs,
        method: 'representativeWeights',
        seed: settings.randomSeed
      }
    );
    const postCommand = {
      problem: postProblem,
      scenario: scenario
    };
    Axios.post('/patavi/weights', postCommand).then(
      (result: AxiosResponse<IWeights>) => {
        const updatedScenario = _.merge({}, scenario, {
          state: {weights: result.data}
        });
        updateScenarioCallback(updatedScenario);
      }
    );
  }

  function updateScenario(newScenario: IScenario): Promise<void> {
    return Axios.post(
      `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${newScenario.id}`,
      newScenario
    )
      .then(_.partial(updateScenarioCallback, newScenario))
      .catch(errorCallback);
  }

  function updateScenarioCallback(scenario: IScenario) {
    let scenarioToAdd: Record<string, IScenario> = {};
    scenarioToAdd[scenario.id] = scenario;
    setScenarios({...contextScenarios, ...scenarioToAdd});
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

  function errorCallback(error: IError) {
    setError(error.message);
  }

  function getCriterion(id: string): IProblemCriterion {
    return problem.criteria[id];
  }

  function determineElicitationMethod(): string {
    if (!currentScenario.state.prefs.length) {
      return 'None';
    } else {
      switch (currentScenario.state.prefs[0].elicitationMethod) {
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

  return (
    <PreferencesContext.Provider
      value={{
        scenarios: contextScenarios,
        currentScenario,
        problem,
        pvfs,
        criteria,
        disableWeightsButtons,
        activeView,
        setCurrentScenario,
        updateScenario,
        deleteScenario,
        copyScenario,
        addScenario,
        getCriterion,
        getPvf,
        setLinearPvf,
        resetPreferences,
        setActiveView,
        determineElicitationMethod
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
