import {CircularProgress} from '@material-ui/core';
import IWeights from '@shared/interface/IWeights';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPreferences} from '@shared/types/Preferences';
import {TPvfDirection} from '@shared/types/TPvfDirection';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getWeightsPataviProblem} from 'app/ts/util/PataviUtil';
import {CurrentSubproblemContext} from 'app/ts/Workspace/SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {useHistory, useParams} from 'react-router';
import {
  areAllPvfsSet,
  createScenarioWithPvf,
  determineElicitationMethod,
  initPvfs
} from '../PreferencesUtil';
import {ScenariosContext} from '../ScenariosContext';
import {TPreferencesView} from '../TPreferencesView';
import ICurrentScenarioContext from './ICurrentScenarioContext';

export const CurrentScenarioContext = createContext<ICurrentScenarioContext>(
  {} as ICurrentScenarioContext
);

export function CurrentScenarioContextProviderComponent({
  children
}: {
  children: any;
}) {
  const history = useHistory();
  const {workspaceId, subproblemId, scenarioId} = useParams<{
    workspaceId: string;
    subproblemId: string;
    scenarioId: string;
  }>();

  const {setError} = useContext(ErrorContext);
  const {
    settings: {randomSeed}
  } = useContext(SettingsContext);

  const {
    filteredCriteria,
    filteredWorkspace,
    getCriterion,
    configuredRanges,
    getConfiguredRange
  } = useContext(CurrentSubproblemContext);
  const {getScenario, updateScenarios} = useContext(ScenariosContext);

  const [currentScenario, setCurrentScenario] = useState<IMcdaScenario>(
    getScenario(scenarioId)
  );
  const [pvfs, setPvfs] = useState<Record<string, TPvf>>();
  const disableWeightsButtons = !areAllPvfsSet(filteredCriteria, pvfs);
  const [activeView, setActiveView] = useState<TPreferencesView>('preferences');
  const [elicitationMethod, setElicitationMethod] = useState<string>(
    determineElicitationMethod(currentScenario.state.prefs)
  );
  const [
    advancedPvfCriterionId,
    setAdvancedPvfCriterionId
  ] = useState<string>();

  const getWeights = useCallback(
    (scenario: IMcdaScenario, pvfs: Record<string, TPvf>): void => {
      const postCommand = getWeightsPataviProblem(
        filteredWorkspace,
        scenario,
        pvfs,
        randomSeed
      );
      Axios.post('/api/v2/patavi/weights', postCommand).then(
        (result: AxiosResponse<IWeights>) => {
          const updatedScenario = _.merge({}, scenario, {
            state: {weights: result.data}
          });
          setCurrentScenario(updatedScenario);
          updateScenarios(updatedScenario);
        }
      );
    },
    [filteredWorkspace, randomSeed, updateScenarios]
  );

  useEffect(() => {
    setCurrentScenario(getScenario(scenarioId));
  }, [getScenario, scenarioId]);

  useEffect(() => {
    if (!_.isEmpty(configuredRanges)) {
      const newPvfs = initPvfs(
        filteredCriteria,
        currentScenario,
        configuredRanges
      );
      setPvfs(newPvfs);
      if (
        areAllPvfsSet(filteredCriteria, newPvfs) &&
        !currentScenario.state.weights
      ) {
        getWeights(currentScenario, newPvfs);
      }
      setElicitationMethod(
        determineElicitationMethod(currentScenario.state.prefs)
      );
    }
  }, [configuredRanges, currentScenario, filteredCriteria, getWeights]);

  function getPvf(criterionId: string): TPvf {
    return pvfs[criterionId];
  }

  function resetPreferences(scenario: IMcdaScenario) {
    const newScenario = {
      ...scenario,
      state: {
        ..._.pick(scenario.state, ['problem', 'legend', 'uncertaintyOptions']),
        prefs: [] as TPreferences
      }
    };
    getWeights(newScenario, pvfs);
  }

  function updateScenario(newScenario: IMcdaScenario): Promise<void> {
    return Axios.post(
      `/api/v2/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${newScenario.id}`,
      newScenario
    )
      .then(() => {
        setCurrentScenario(newScenario);
        updateScenarios(newScenario);
      })
      .catch(setError);
  }

  function goToAdvancedPvf(criterionId: string): void {
    setAdvancedPvfCriterionId(criterionId);
    setActiveView('advancedPvf');
  }

  function setPvf(criterionId: string, pvf: TPvf): void {
    const newPvfs = {...pvfs, [criterionId]: pvf};
    setPvfs(newPvfs);
    const newScenario = createScenarioWithPvf(
      criterionId,
      pvf,
      currentScenario
    );
    updateScenario(newScenario).then(() => {
      if (areAllPvfsSet(filteredCriteria, newPvfs)) {
        resetPreferences(newScenario);
      }
    });
  }

  function setLinearPvf(criterionId: string, direction: TPvfDirection): void {
    const range = getConfiguredRange(getCriterion(criterionId));
    const pvf: ILinearPvf = {
      type: 'linear',
      range: range,
      direction: direction
    };
    setPvf(criterionId, pvf);
  }

  return (
    <CurrentScenarioContext.Provider
      value={{
        advancedPvfCriterionId,
        areAllPvfsSet: areAllPvfsSet(filteredCriteria, pvfs),
        currentScenario,
        pvfs,
        disableWeightsButtons,
        activeView,
        elicitationMethod,
        setCurrentScenario,
        updateScenario,
        getPvf,
        goToAdvancedPvf,
        setPvf,
        setLinearPvf,
        resetPreferences,
        setActiveView
      }}
    >
      {currentScenario ? children : <CircularProgress />}
    </CurrentScenarioContext.Provider>
  );
}
