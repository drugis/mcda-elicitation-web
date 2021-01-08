import React, {createContext, useEffect, useState} from 'react';
import {ISmaaResultsContext} from './ISmaaResultsContext';

export const SmaaResultsContext = createContext<ISmaaResultsContext>(
  {} as ISmaaResultsContext
);

export function SmaaResultsContextProviderComponent({
  children
}: {
  children: any;
}) {
  const [
    useMeasurementsUncertainty,
    setUseMeasurementsUncertainty
  ] = useState<boolean>(true);
  const [useWeightsUncertainty, setUseWeightsUncertainty] = useState<boolean>(
    true
  );
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    setWarnings(getWarnings());
  }, [useMeasurementsUncertainty, useWeightsUncertainty]);

  function getWarnings(): string[] {
    let warnings: string[] = [];
    if (!useMeasurementsUncertainty && !useWeightsUncertainty) {
      warnings.push(
        'SMAA results will be identical to the deterministic results because there are no stochastic inputs'
      );
    }
    return warnings;
  }

  return (
    <SmaaResultsContext.Provider
      value={{
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
