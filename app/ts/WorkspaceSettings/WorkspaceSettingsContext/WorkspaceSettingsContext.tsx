import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TPercentageOrDecimal} from '@shared/interface/Settings/TPercentageOrDecimal';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {createContext, useContext, useState} from 'react';
import {getWarnings} from '../../Settings/SettingsUtil';
import IWorkspaceSettingsContext from './IWorkspaceSettingsContext';

export const WorkspaceSettingsContext = createContext<IWorkspaceSettingsContext>(
  {} as IWorkspaceSettingsContext
);

export function WorkspaceSettingsContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {
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
  const [localAnalysisType, setLocalAnalysisType] = useState<TAnalysisType>(
    analysisType
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

  const [warnings, setWarnings] = useState<string[]>([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(
    false
  );

  function setLocalDisplayModeWrapper(newMode: TDisplayMode) {
    setLocalDisplayMode(newMode);
    setWarnings(
      getWarnings(
        isRelativeProblem,
        newMode,
        analysisType,
        hasNoEffects,
        hasNoDistributions
      )
    );
  }

  function setLocalAnalysisTypeWrapper(newType: TAnalysisType) {
    setLocalAnalysisType(newType);
    setWarnings(
      getWarnings(
        isRelativeProblem,
        displayMode,
        newType,
        hasNoEffects,
        hasNoDistributions
      )
    );
  }

  function resetToDefaults(): void {
    setLocalScalesCalculationMethod('median');
    setLocalShowPercentages('percentage');
    setLocalDisplayModeWrapper(isRelativeProblem ? 'enteredData' : 'values');
    setLocalAnalysisTypeWrapper('deterministic');
    setLocalRandomSeed(1234);
    setLocalShowDescriptions(true);
    setLocalShowUnitsOfMeasurement(true);
    setLocalShowReferences(true);
    setLocalShowStrengthsAndUncertainties(true);
    setIsSaveButtonDisabled(false);
  }

  function saveSettings(): void {
    const newSettings: Omit<
      ISettings,
      'isRelativeProblem' | 'hasNoEffects' | 'hasNoDistributions'
    > = {
      analysisType: localAnalysisType,
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
        localAnalysisType,
        localRandomSeed,
        localShowDescriptions,
        localShowUnitsOfMeasurement,
        localShowReferences,
        localShowStrengthsAndUncertainties,
        warnings,
        resetToDefaults,
        saveSettings,
        setLocalShowPercentages,
        setLocalScalesCalculationMethod,
        setLocalDisplayMode: setLocalDisplayModeWrapper,
        setLocalAnalysisType: setLocalAnalysisTypeWrapper,
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
