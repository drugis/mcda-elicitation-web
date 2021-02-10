import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';
import React, {createContext, useEffect, useState} from 'react';
import ISettingsContext from './ISettingsContext';
import {calculateNumberOfToggledColumns, settingsChanged} from './SettingsUtil';

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
);

export function SettingsContextProviderComponent({
  children,
  settings,
  toggledColumns,
  updateAngularSettings
}: {
  children: any;
  settings: ISettings;
  toggledColumns: IToggledColumns;
  updateAngularSettings: (
    settings: ISettings,
    toggledColumns: IToggledColumns
  ) => void;
}) {
  const [
    scalesCalculationMethod,
    setScalesCalculationMethod
  ] = useState<TScalesCalculationMethod>('median');
  const [showPercentages, setShowPercentages] = useState<boolean>(true);

  const [isRelativeProblem, setIsRelativeProblem] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<TDisplayMode>(
    isRelativeProblem ? 'values' : 'enteredData'
  );
  const [analysisType, setAnalysisType] = useState<TAnalysisType>(
    'deterministic'
  );
  const [hasNoEffects, setHasNoEffects] = useState<boolean>(false);
  const [hasNoDistributions, setHasNoDistributions] = useState<boolean>(false);
  const [randomSeed, setRandomSeed] = useState<number>(1234);
  const [showDescriptions, setShowDescriptions] = useState<boolean>(true);
  const [showUnitsOfMeasurement, setShowUnitsOfMeasurement] = useState<boolean>(
    true
  );
  const [showReferences, setShowReferences] = useState<boolean>(true);
  const [
    showStrengthsAndUncertainties,
    setShowStrengthsAndUncertainties
  ] = useState<boolean>(true);
  const [currentSettings, setCurrentSettings] = useState<ISettings>();
  const [
    currentToggledColumns,
    setCurrentToggledColumns
  ] = useState<IToggledColumns>();
  const [
    numberOfToggledColumns,
    setNumberOfToggledColumns
  ] = useState<number>();

  useEffect(() => {
    setScalesCalculationMethod(settings.calculationMethod);
    setShowPercentages(settings.showPercentages === 'percentage');
    setDisplayMode(
      settings.isRelativeProblem ? 'values' : settings.displayMode
    );
    setAnalysisType(settings.analysisType);
    setHasNoEffects(settings.hasNoEffects);
    setHasNoDistributions(settings.hasNoDistributions);
    setIsRelativeProblem(settings.isRelativeProblem);
    setRandomSeed(settings.randomSeed);
    setShowDescriptions(toggledColumns.description);
    setShowUnitsOfMeasurement(toggledColumns.units);
    setShowReferences(toggledColumns.references);
    setShowStrengthsAndUncertainties(toggledColumns.strength);
    setCurrentSettings(settings);
    setCurrentToggledColumns(toggledColumns);
    setNumberOfToggledColumns(calculateNumberOfToggledColumns(toggledColumns));
  }, []);
  //FIXME: axios the settings

  function updateSettings(
    updatedSettings: Omit<
      ISettings,
      'isRelativeProblem' | 'hasNoEffects' | 'hasNoDistributions'
    >,
    updatedToggledColumns: IToggledColumns
  ): void {
    if (
      settingsChanged(
        currentSettings,
        currentToggledColumns,
        updatedSettings,
        updatedToggledColumns
      )
    ) {
      setScalesCalculationMethod(updatedSettings.calculationMethod);
      setShowPercentages(updatedSettings.showPercentages === 'percentage');
      setDisplayMode(updatedSettings.displayMode);
      setAnalysisType(updatedSettings.analysisType);
      setRandomSeed(updatedSettings.randomSeed);
      setShowDescriptions(updatedToggledColumns.description);
      setShowUnitsOfMeasurement(updatedToggledColumns.units);
      setShowReferences(updatedToggledColumns.references);
      setShowStrengthsAndUncertainties(updatedToggledColumns.strength);
      setNumberOfToggledColumns(
        calculateNumberOfToggledColumns(updatedToggledColumns)
      );
      updateAngularSettings(
        {
          ...updatedSettings,
          isRelativeProblem: isRelativeProblem,
          hasNoEffects: hasNoEffects,
          hasNoDistributions: hasNoDistributions
        },
        updatedToggledColumns
      );
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        scalesCalculationMethod,
        showPercentages,
        displayMode,
        analysisType,
        hasNoEffects,
        hasNoDistributions,
        isRelativeProblem,
        randomSeed,
        showDescriptions,
        showUnitsOfMeasurement,
        showReferences,
        showStrengthsAndUncertainties,
        numberOfToggledColumns,
        updateSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
