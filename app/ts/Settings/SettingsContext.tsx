import ISettings from '@shared/interface/ISettings';
import IToggledColumns from '@shared/interface/IToggledColumns';
import _ from 'lodash';
import React, {createContext} from 'react';
import ISettingsContext from './ISettingsContext';

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
);

export function SettingsContextProviderComponent({
  children,
  settings,
  toggledColumns
}: {
  children: any;
  settings: ISettings;
  toggledColumns: IToggledColumns;
}) {
  const numberOfToggledColumns =
    1 +
    _.filter(
      _.pick(toggledColumns, ['description', 'units', 'references', 'strength'])
    ).length;
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
        randomSeed: settings.randomSeed,
        showDescriptions: toggledColumns.description,
        showUnitsOfMeasurement: toggledColumns.units,
        showRefereces: toggledColumns.references,
        showStrengthsAndUncertainties: toggledColumns.strength,
        numberOfToggledColumns: numberOfToggledColumns
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
