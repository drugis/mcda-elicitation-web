import {Distribution} from '@shared/interface/IDistribution';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {TPreferences} from '@shared/types/Preferences';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ISmaaResultsContext} from './ISmaaResultsContext';

export const SmaaResultsContext = createContext<ISmaaResultsContext>(
  {} as ISmaaResultsContext
);

export function SmaaResultsContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {filteredDistributions} = useContext(SubproblemContext);
  const {currentScenario} = useContext(PreferencesContext);

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

  useEffect(() => {
    const problemHasStochasticMeasurements = hasStochasticMeasurements(
      filteredDistributions
    );
    const problemHasStochasticWeights = hasStochasticWeights(
      currentScenario.state.prefs
    );
    setWarnings(
      getWarnings(problemHasStochasticMeasurements, problemHasStochasticWeights)
    );
    setIsMeasurementUncertaintyDisabled(!problemHasStochasticMeasurements);
    setIsWeightsUncertaintyDisabled(!problemHasStochasticWeights);
  }, [
    useMeasurementsUncertainty,
    useWeightsUncertainty,
    filteredDistributions
  ]);

  function getWarnings(
    problemHasStochasticMeasurements: boolean,
    problemHasStochasticWeights: boolean
  ): string[] {
    let warnings: string[] = [];
    if (
      (!useMeasurementsUncertainty || isMeasurementUncertaintyDisabled) &&
      (!useWeightsUncertainty || isWeightsUncertaintyDisabled)
    ) {
      warnings.push(
        'SMAA results will be identical to the deterministic results because there are no stochastic inputs'
      );
    }
    if (!problemHasStochasticMeasurements) {
      warnings.push('Measurements are not stochastic');
    }
    if (!problemHasStochasticWeights) {
      warnings.push('Weights are not stochastic');
    }
    return warnings;
  }

  function hasStochasticMeasurements(
    filteredDistributions: Distribution[]
  ): boolean {
    return _.some(
      filteredDistributions,
      (distribution: Distribution) =>
        distribution.type !== 'value' &&
        distribution.type !== 'empty' &&
        distribution.type !== 'text'
    );
  }

  function hasStochasticWeights(preferences: TPreferences) {
    const NON_EXACT_PREFERENCE_TYPES = ['ordinal', 'ratio bound'];
    return _.some(
      preferences,
      (preference: IRanking | IExactSwingRatio | IRatioBoundConstraint) =>
        NON_EXACT_PREFERENCE_TYPES.indexOf(preference.type) >= 0
    );
  }

  return (
    <SmaaResultsContext.Provider
      value={{
        isMeasurementUncertaintyDisabled,
        isWeightsUncertaintyDisabled,
        useMeasurementsUncertainty,
        useWeightsUncertainty,
        warnings,
        setUseMeasurementsUncertainty,
        setUseWeightsUncertainty
      }}
    >
      {children}
    </SmaaResultsContext.Provider>
  );
}
