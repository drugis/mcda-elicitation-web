import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';
import {ISmaaResultsCommand} from '@shared/interface/Patavi/ISmaaResultsCommand';
import IWeights from '@shared/interface/Scenario/IWeights';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {getPataviProblem} from 'app/ts/util/PataviUtil';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  hasStochasticMeasurements,
  hasStochasticWeights
} from '../SmaaResults/SmaaResultsUtil';
import {ISmaaResultsContext} from './ISmaaResultsContext';

export const SmaaResultsContext = createContext<ISmaaResultsContext>(
  {} as ISmaaResultsContext
);

export function SmaaResultsContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {setError} = useContext(ErrorContext);
  const {
    settings: {randomSeed}
  } = useContext(SettingsContext);
  const {
    filteredDistributions,
    filteredRelativePerformances,
    filteredWorkspace
  } = useContext(CurrentSubproblemContext);
  const {currentScenario, updateScenario, pvfs} = useContext(
    CurrentScenarioContext
  );

  const problemHasStochasticMeasurements =
    hasStochasticMeasurements(filteredDistributions) ||
    filteredRelativePerformances.length > 0;
  const problemHasStochasticWeights = hasStochasticWeights(
    currentScenario.state.prefs
  );

  const [
    useMeasurementsUncertainty,
    setUseMeasurementsUncertainty
  ] = useState<boolean>(
    problemHasStochasticMeasurements &&
      (currentScenario.state.uncertaintyOptions
        ? currentScenario.state.uncertaintyOptions.measurements
        : true)
  );
  const [useWeightsUncertainty, setUseWeightsUncertainty] = useState<boolean>(
    problemHasStochasticWeights &&
      (currentScenario.state.uncertaintyOptions
        ? currentScenario.state.uncertaintyOptions.weights
        : true)
  );

  const [centralWeights, setCentralWeights] = useState<
    Record<string, ICentralWeight>
  >();
  const [ranks, setRanks] = useState<Record<string, number[]>>();
  const [smaaWeights, setSmaaWeights] = useState<IWeights>();

  const calculateResults = useCallback((): void => {
    const pataviProblem = getPataviProblem(
      filteredWorkspace,
      currentScenario.state.prefs,
      pvfs,
      false
    );

    const smaaResultsCommand: ISmaaResultsCommand = {
      ...pataviProblem,
      preferences: currentScenario.state.prefs,
      method: 'smaa',
      uncertaintyOptions: {
        measurements: useMeasurementsUncertainty,
        weights: useWeightsUncertainty
      },
      seed: randomSeed
    };

    setCentralWeights(undefined);
    setRanks(undefined);
    setSmaaWeights(undefined);

    Axios.post('/api/v2/patavi/smaaResults', smaaResultsCommand)
      .then((result: AxiosResponse<ISmaaResults>) => {
        setCentralWeights(result.data.cw);
        setRanks(result.data.ranks);
        setSmaaWeights(result.data.weightsQuantiles);
      })
      .catch(setError);
  }, [
    currentScenario.state.prefs,
    filteredWorkspace,
    pvfs,
    randomSeed,
    setError,
    useMeasurementsUncertainty,
    useWeightsUncertainty
  ]);

  useEffect(() => {
    if (!_.isEmpty(pvfs)) {
      calculateResults();
    }
  }, [calculateResults, pvfs]);

  return (
    <SmaaResultsContext.Provider
      value={{
        centralWeights,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights,
        ranks,
        smaaWeights,
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        setUseMeasurementsUncertainty,
        setUseWeightsUncertainty
      }}
    >
      {children}
    </SmaaResultsContext.Provider>
  );
}
