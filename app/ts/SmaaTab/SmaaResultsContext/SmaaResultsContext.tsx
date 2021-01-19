import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';
import {ISmaaResultsCommand} from '@shared/interface/Patavi/ISmaaResultsCommand';
import IWeights from '@shared/interface/Scenario/IWeights';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getPataviProblem} from 'app/ts/util/PataviUtil';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import Axios, {AxiosResponse} from 'axios';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getSmaaWarnings,
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
  const {randomSeed} = useContext(SettingsContext);
  const {
    filteredDistributions,
    filteredRelativePerformances,
    filteredAlternatives,
    filteredCriteria
  } = useContext(SubproblemContext);
  const {currentScenario, problem, updateScenario, pvfs} = useContext(
    PreferencesContext
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

  const [warnings, setWarnings] = useState<string[]>(
    getSmaaWarnings(
      useMeasurementsUncertainty,
      useWeightsUncertainty,
      problemHasStochasticMeasurements,
      problemHasStochasticWeights
    )
  );
  const [centralWeights, setCentralWeights] = useState<
    Record<string, ICentralWeight>
  >();
  const [ranks, setRanks] = useState<Record<string, number[]>>();
  const [smaaWeights, setSmaaWeights] = useState<IWeights>();

  useEffect(calculateResults, []);

  useEffect(() => {
    setWarnings(
      getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      )
    );
  }, [useMeasurementsUncertainty, useWeightsUncertainty]);

  function recalculate(): void {
    updateScenario({
      ...currentScenario,
      state: {
        ...currentScenario.state,
        uncertaintyOptions: {
          measurements: useMeasurementsUncertainty,
          weights: useWeightsUncertainty
        }
      }
    }).then(calculateResults);
  }

  function calculateResults(): void {
    const pataviProblem = getPataviProblem(
      problem,
      filteredCriteria,
      filteredAlternatives,
      pvfs
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

    Axios.post('/patavi/smaaResults', smaaResultsCommand)
      .then((result: AxiosResponse<ISmaaResults>) => {
        setCentralWeights(result.data.cw);
        setRanks(result.data.ranks);
        setSmaaWeights(result.data.weightsQuantiles);
      })
      .catch(setError);
  }

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
        warnings,
        recalculate,
        setUseMeasurementsUncertainty,
        setUseWeightsUncertainty
      }}
    >
      {children}
    </SmaaResultsContext.Provider>
  );
}
