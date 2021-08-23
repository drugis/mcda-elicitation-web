import IWeights from '@shared/interface/IWeights';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import IEquivalentChange from '@shared/interface/Scenario/IEquivalentChange';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPreferences} from '@shared/types/preferences';
import {TPvfDirection} from '@shared/types/TPvfDirection';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import {getWeightsPataviProblem} from 'app/ts/util/PataviUtil';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {useParams} from 'react-router';
import {
  areAllPvfsSet,
  calculateWeightsFromPreferences,
  createScenarioWithPvf,
  determineElicitationMethod,
  hasNonLinearPvf,
  initPvfs
} from '../ScenariosContext/preferencesUtil';
import {ScenariosContext} from '../ScenariosContext/ScenariosContext';
import {TPreferencesView} from '../ScenariosContext/TPreferencesView';
import ICurrentScenarioContext from './ICurrentScenarioContext';

export const CurrentScenarioContext = createContext<ICurrentScenarioContext>(
  {} as ICurrentScenarioContext
);

export function CurrentScenarioContextProviderComponent({
  children
}: {
  children: any;
}) {
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
  const [advancedPvfCriterionId, setAdvancedPvfCriterionId] =
    useState<string>();
  const [isThresholdElicitationDisabled, setIsThresholdElicitationDisabled] =
    useState(true);
  const [isScenarioUpdating, setIsScenarioUpdating] = useState(false);

  const getWeightsFromPatavi = useCallback(
    (scenario: IMcdaScenario, pvfs: Record<string, TPvf>) => {
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

  const getWeightsThroughCalculation = useCallback(
    (scenario: IMcdaScenario) => {
      const updatedScenario = _.merge({}, scenario, {
        state: {
          weights: calculateWeightsFromPreferences(
            filteredCriteria,
            scenario.state.prefs
          )
        }
      });
      setCurrentScenario(updatedScenario);
      updateScenarios(updatedScenario);
    },
    [filteredCriteria, updateScenarios]
  );

  const getWeights = useCallback(
    (scenario: IMcdaScenario, pvfs: Record<string, TPvf>): void => {
      if (scenario.state.prefs[0]?.elicitationMethod === 'imprecise') {
        getWeightsFromPatavi(scenario, pvfs);
      } else {
        getWeightsThroughCalculation(scenario);
      }
    },
    [getWeightsFromPatavi, getWeightsThroughCalculation]
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
      setIsThresholdElicitationDisabled(hasNonLinearPvf(newPvfs));
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
    const newScenario: IMcdaScenario = {
      ...scenario,
      state: {
        ..._.pick(scenario.state, ['problem', 'legend', 'uncertaintyOptions']),
        prefs: [] as TPreferences,
        thresholdValuesByCriterion: {},
        equivalentChange: undefined
      }
    };
    getWeights(newScenario, pvfs);
  }

  function updateScenario(newScenario: IMcdaScenario): Promise<void> {
    setIsScenarioUpdating(true);
    return Axios.post(
      `/api/v2/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${newScenario.id}`,
      newScenario
    )
      .then(() => {
        setCurrentScenario(newScenario);
        updateScenarios(newScenario);
      })
      .catch(setError)
      .finally(() => {
        setIsScenarioUpdating(false);
      });
  }

  function goToAdvancedPvf(criterionId: string): void {
    setAdvancedPvfCriterionId(criterionId);
    setActiveView('advancedPvf');
  }

  function setPvf(criterionId: string, pvf: TPvf): Promise<void> {
    const newPvfs = {...pvfs, [criterionId]: pvf};
    setPvfs(newPvfs);
    const newScenario = createScenarioWithPvf(
      criterionId,
      pvf,
      currentScenario
    );
    return updateScenario(newScenario).then(() => {
      if (areAllPvfsSet(filteredCriteria, newPvfs)) {
        resetPreferences(newScenario);
      }
    });
  }

  function setLinearPvf(
    criterionId: string,
    direction: TPvfDirection
  ): Promise<void> {
    const range = getConfiguredRange(getCriterion(criterionId));
    const pvf: ILinearPvf = {
      type: 'linear',
      range: range,
      direction: direction
    };
    return setPvf(criterionId, pvf);
  }

  function updateEquivalentChange(
    newEquivalentChange: IEquivalentChange
  ): Promise<void> {
    return updateScenario({
      ...currentScenario,
      state: {
        ...currentScenario.state,
        equivalentChange: newEquivalentChange
      }
    });
  }

  return (
    <CurrentScenarioContext.Provider
      value={{
        advancedPvfCriterionId,
        areAllPvfsSet: areAllPvfsSet(filteredCriteria, pvfs),
        currentScenario,
        pvfs,
        isThresholdElicitationDisabled,
        disableWeightsButtons,
        activeView,
        elicitationMethod,
        equivalentChange: currentScenario.state.equivalentChange,
        isScenarioUpdating,
        setCurrentScenario,
        updateScenario,
        getPvf,
        goToAdvancedPvf,
        setPvf,
        setLinearPvf,
        updateEquivalentChange,
        resetPreferences,
        setActiveView
      }}
    >
      <LoadingSpinner showSpinnerCondition={!currentScenario}>
        {children}
      </LoadingSpinner>
    </CurrentScenarioContext.Provider>
  );
}
