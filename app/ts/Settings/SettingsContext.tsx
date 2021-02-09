import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
import ISettingsAndToggledColumns from '@shared/interface/Settings/ISettingsAndToggledColumns';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TPercentageOrDecimal} from '@shared/interface/Settings/TPercentageOrDecimal';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';
import React, {createContext, useEffect, useState} from 'react';
import ISettingsContext from './ISettingsContext';
import {calculateNumberOfToggledColumns} from './SettingsUtil';

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
  const DEFAULT_SETTINGS = {
    calculationMethod: 'median',
    showPercentages: true,
    displayMode: 'enteredData',
    analysisType: 'deterministic',
    hasNoEffects: false,
    hasNoDistributions: false,
    isRelativeProblem: false,
    changed: false,
    randomSeed: 1234
  };

  const [
    scalesCalculationMethod,
    setScalesCalculationMethod
  ] = useState<TScalesCalculationMethod>('median');
  const [showPercentages, setShowPercentages] = useState<TPercentageOrDecimal>(
    'percentage'
  );

  const [displayMode, setDisplayMode] = useState<TDisplayMode>('enteredData');
  const [analysisType, setAnalysisType] = useState<TAnalysisType>(
    'deterministic'
  );
  const [hasNoEffects, setHasNoEffects] = useState<boolean>(false);
  const [hasNoDistributions, setHasNoDistributions] = useState<boolean>(false);
  const [isRelativeProblem, setIsRelativeProblem] = useState<boolean>(false);
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
  const [inputSettings, setInputSettings] = useState<ISettings>();
  const [
    numberOfToggledColumns,
    setNumberOfToggledColumns
  ] = useState<number>();

  useEffect(() => {
    setScalesCalculationMethod(settings.calculationMethod);
    setShowPercentages(settings.showPercentages ? 'percentage' : 'decimal');
    setDisplayMode(settings.displayMode);
    setAnalysisType(settings.analysisType);
    setHasNoEffects(settings.hasNoEffects);
    setHasNoDistributions(settings.hasNoDistributions);
    setIsRelativeProblem(settings.isRelativeProblem);
    setRandomSeed(settings.randomSeed);
    setShowDescriptions(toggledColumns.description);
    setShowUnitsOfMeasurement(toggledColumns.units);
    setShowReferences(toggledColumns.references);
    setShowStrengthsAndUncertainties(toggledColumns.strength);
    setInputSettings(settings);
    setNumberOfToggledColumns(calculateNumberOfToggledColumns(toggledColumns));
  }, []);

  function updateSettings(updatedSettings: ISettingsAndToggledColumns): void {
    setScalesCalculationMethod(updatedSettings.calculationMethod);
    setShowPercentages(
      updatedSettings.showPercentages ? 'percentage' : 'decimal'
    );
    setDisplayMode(updatedSettings.displayMode);
    setAnalysisType(updatedSettings.analysisType);
    setHasNoEffects(updatedSettings.hasNoEffects);
    setHasNoDistributions(updatedSettings.hasNoDistributions);
    setIsRelativeProblem(updatedSettings.isRelativeProblem);
    setRandomSeed(updatedSettings.randomSeed);
    setShowDescriptions(updatedSettings.description);
    setShowUnitsOfMeasurement(updatedSettings.units);
    setShowReferences(updatedSettings.references);
    setShowStrengthsAndUncertainties(updatedSettings.strength);
    setNumberOfToggledColumns(calculateNumberOfToggledColumns(updatedSettings));
    // callback
  }

  return (
    <SettingsContext.Provider
      value={{
        scalesCalculationMethod,
        showPercentages: showPercentages === 'percentage',
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
