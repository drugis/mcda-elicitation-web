import ISettings from '@shared/interface/Settings/ISettings';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TPercentageOrDecimal} from '@shared/interface/Settings/TPercentageOrDecimal';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {createContext, useContext, useEffect, useState} from 'react';
import IWorkspaceSettingsContext from './IWorkspaceSettingsContext';

export const WorkspaceSettingsContext = createContext<IWorkspaceSettingsContext>(
  {} as IWorkspaceSettingsContext
);

export function WorkspaceSettingsContextProviderComponent({
  children,
  isDialogOpen
}: {
  children: any;
  isDialogOpen: boolean;
}) {
  const {
    scalesCalculationMethod,
    showPercentages,
    displayMode,
    hasNoEffects,
    hasNoDistributions,
    isRelativeProblem,
    randomSeed,
    showDescriptions,
    showUnitsOfMeasurement,
    showReferences,
    showStrengthsAndUncertainties,
    updateSettings
  } = useContext(SettingsContext);

  const [
    localScalesCalculationMethod,
    setLocalScalesCalculationMethod
  ] = useState(scalesCalculationMethod);
  const [
    localShowPercentages,
    setLocalShowPercentages
  ] = useState<TPercentageOrDecimal>(
    showPercentages ? 'percentage' : 'decimal'
  );
  const [localDisplayMode, setLocalDisplayMode] = useState<TDisplayMode>(
    displayMode
  );
  const [localRandomSeed, setLocalRandomSeed] = useState<number>(randomSeed);
  const [localShowDescriptions, setLocalShowDescriptions] = useState<boolean>(
    showDescriptions
  );
  const [
    localShowUnitsOfMeasurement,
    setLocalShowUnitsOfMeasurement
  ] = useState<boolean>(showUnitsOfMeasurement);
  const [localShowReferences, setLocalShowReferences] = useState<boolean>(
    showReferences
  );
  const [
    localShowStrengthsAndUncertainties,
    setLocalShowStrengthsAndUncertainties
  ] = useState<boolean>(showStrengthsAndUncertainties);

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (isDialogOpen) {
      setIsSaveButtonDisabled(false);
      setLocalScalesCalculationMethod(scalesCalculationMethod);
      setLocalShowPercentages(showPercentages ? 'percentage' : 'decimal');
      setLocalDisplayMode(displayMode);
      setLocalRandomSeed(randomSeed);
      setLocalShowDescriptions(showDescriptions);
      setLocalShowUnitsOfMeasurement(showUnitsOfMeasurement);
      setLocalShowReferences(showReferences);
    }
  }, [isDialogOpen]);

  function resetToDefaults(): void {
    setLocalScalesCalculationMethod('median');
    setLocalShowPercentages('percentage');
    setLocalDisplayMode(isRelativeProblem ? 'smaaValues' : 'enteredEffects');
    setLocalRandomSeed(1234);
    setLocalShowDescriptions(true);
    setLocalShowUnitsOfMeasurement(true);
    setLocalShowReferences(true);
    setLocalShowStrengthsAndUncertainties(true);
    setIsSaveButtonDisabled(false);
  }

  function saveSettings(): void {
    const newSettings: ISettings = {
      calculationMethod: localScalesCalculationMethod,
      displayMode: localDisplayMode,
      showPercentages: localShowPercentages,
      randomSeed: localRandomSeed
    };
    const newToggledColumns: IToggledColumns = {
      description: localShowDescriptions,
      references: localShowReferences,
      units: localShowUnitsOfMeasurement,
      strength: localShowStrengthsAndUncertainties
    };
    updateSettings(newSettings, newToggledColumns);
  }

  return (
    <WorkspaceSettingsContext.Provider
      value={{
        isSaveButtonDisabled,
        localShowPercentages,
        localScalesCalculationMethod,
        localDisplayMode,
        localRandomSeed,
        localShowDescriptions,
        localShowUnitsOfMeasurement,
        localShowReferences,
        localShowStrengthsAndUncertainties,
        resetToDefaults,
        saveSettings,
        setLocalShowPercentages,
        setLocalScalesCalculationMethod,
        setLocalDisplayMode,
        setLocalRandomSeed,
        setLocalShowDescriptions,
        setLocalShowUnitsOfMeasurement,
        setLocalShowReferences,
        setLocalShowStrengthsAndUncertainties,
        setIsSaveButtonDisabled
      }}
    >
      {children}
    </WorkspaceSettingsContext.Provider>
  );
}
