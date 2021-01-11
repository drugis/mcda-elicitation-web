import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';
import {ISmaaResultsCommand} from '@shared/interface/Patavi/ISmaaResultsCommand';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  buildPataviPerformaceTable,
  getSmaaWarnings,
  hasStochasticMeasurements,
  hasStochasticWeights,
  mergeDataSourceOntoCriterion
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
  const {filteredDistributions} = useContext(SubproblemContext);
  const {currentScenario, problem, updateScenario} = useContext(
    PreferencesContext
  );

  const problemHasStochasticMeasurements = hasStochasticMeasurements(
    filteredDistributions
  );
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
  const [results, setResults] = useState<ISmaaResults>();

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
    const smaaResultsCommand: ISmaaResultsCommand = {
      ..._.omit(problem, 'preferences'),
      ...currentScenario.state.problem,
      preferences: currentScenario.state.prefs,
      method: 'smaa',
      uncertaintyOptions: {
        measurements: useMeasurementsUncertainty,
        weights: useWeightsUncertainty
      },
      seed: randomSeed,
      criteria: mergeDataSourceOntoCriterion(problem.criteria),
      performanceTable: buildPataviPerformaceTable(problem.performanceTable)
    };

    Axios.post('/patavi/smaaResults', smaaResultsCommand)
      .then((result: AxiosResponse<ISmaaResults>) => {
        setResults(result.data);
      })
      .catch(setError);
  }

  return (
    <SmaaResultsContext.Provider
      value={{
        problemHasStochasticMeasurements,
        problemHasStochasticWeights,
        results,
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
