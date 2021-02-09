import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TPercentageOrDecimal} from '@shared/interface/Settings/TPercentageOrDecimal';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {createContext, useContext, useState} from 'react';
import IWorkspaceSettingsContext from './IWorkspaceSettingsContext';
import {getWarnings} from '../../Settings/SettingsUtil';

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
    showStrengthsAndUncertainties
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
