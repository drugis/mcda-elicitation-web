import ISettings from '@shared/interface/ISettings';
import React, { createContext } from 'react';
import ISettingsContext from './ISettingsContext';

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
);

export function SettingsContextProviderComponent({
  children,
  settings
}: {
  children: any;
  settings: ISettings;
}) {
  return (
    <SettingsContext.Provider
      value={{
        scalesCalculationMethod: settings.calculationMethod,
        showPercentages: settings.showPercentages,
        displayMode: settings.displayMode,
        analysisType: settings.analysisType,
        hasNoEffects: settings.hasNoEffects,
        hasNoDistributions: settings.hasNoDistributions,
        isRelativeProblem: settings.isRelativeProblem,
        changed: settings.changed,
        randomSeed: settings.randomSeed
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
