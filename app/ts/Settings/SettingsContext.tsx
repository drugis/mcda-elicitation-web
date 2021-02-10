import {OurError} from '@shared/interface/IError';
import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
import ISettingsMessage from '@shared/interface/Settings/ISettingsMessage';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import {WorkspaceContext} from '../Workspace/WorkspaceContext';
import ISettingsContext from './ISettingsContext';
import {calculateNumberOfToggledColumns, settingsChanged} from './SettingsUtil';

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
);

export function SettingsContextProviderComponent({children}: {children: any}) {
  const {workspace} = useContext(WorkspaceContext);
  const {setError} = useContext(ErrorContext);

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
    axios
      .get(`/workspaces/${workspace.properties.id}/workspaceSettings`)
      .then((response: AxiosResponse<ISettingsMessage>) => {
        const settings: ISettings = response.data.settings;
        const toggledColumns: IToggledColumns = response.data.toggledColumns;
        if (!_.isEmpty(settings)) {
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
          setNumberOfToggledColumns(
            calculateNumberOfToggledColumns(toggledColumns)
          );
        }
      })
      .catch(errorCallback);
  }, []);

  function errorCallback(error: OurError) {
    setError(error);
  }

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
      // axios put
      window.location.reload();
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
