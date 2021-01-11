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
  const {currentScenario, problem} = useContext(PreferencesContext);

  const [
    useMeasurementsUncertainty,
    setUseMeasurementsUncertainty
  ] = useState<boolean>(true);
  const [
    isMeasurementUncertaintyDisabled,
    setIsMeasurementUncertaintyDisabled
  ] = useState<boolean>(!hasStochasticMeasurements(filteredDistributions));
  const [
    isWeightsUncertaintyDisabled,
    setIsWeightsUncertaintyDisabled
  ] = useState<boolean>(!hasStochasticWeights(currentScenario.state.prefs));
  const [useWeightsUncertainty, setUseWeightsUncertainty] = useState<boolean>(
    true
  );
  const [warnings, setWarnings] = useState<string[]>([]);
  const [results, setResults] = useState<ISmaaResults>();

  useEffect(() => {
    const problemHasStochasticMeasurements = hasStochasticMeasurements(
      filteredDistributions
    );
    const problemHasStochasticWeights = hasStochasticWeights(
      currentScenario.state.prefs
    );
    setWarnings(
      getSmaaWarnings(
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        isMeasurementUncertaintyDisabled,
        isWeightsUncertaintyDisabled,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      )
    );
  }, [
    useMeasurementsUncertainty,
    useWeightsUncertainty,
    filteredDistributions
  ]);

  function calculateResults(): void {
    const smaaResultsCommand: ISmaaResultsCommand = {
      ..._.omit(problem, 'preferences'),
      ...currentScenario.state.problem,
      preferences: currentScenario.state.prefs,
      method: 'smaa',
      uncertaintyOptions: {
        measurements: !isMeasurementUncertaintyDisabled,
        weights: !isWeightsUncertaintyDisabled
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
        isMeasurementUncertaintyDisabled,
        isWeightsUncertaintyDisabled,
        results,
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        warnings,
        calculateResults,
        setUseMeasurementsUncertainty,
        setUseWeightsUncertainty
      }}
    >
      {children}
    </SmaaResultsContext.Provider>
  );
}
