import {OurError} from '@shared/interface/IError';
import ISettings from '@shared/interface/Settings/ISettings';
import ISettingsMessage from '@shared/interface/Settings/ISettingsMessage';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import {WorkspaceContext} from '../Workspace/WorkspaceContext';
import ISettingsContext from './ISettingsContext';
import {
  calculateNumberOfToggledColumns,
  getDisplayMode,
  getInitialDisplayMode
} from './SettingsUtil';

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
);

export function SettingsContextProviderComponent({children}: {children: any}) {
  const {workspace} = useContext(WorkspaceContext);
  const {setError} = useContext(ErrorContext);

  const [hasNoEffects] = useState<boolean>(_.isEmpty(workspace.effects));
  const [hasNoDistributions] = useState<boolean>(
    _.isEmpty(workspace.distributions)
  );
  const [isRelativeProblem] = useState<boolean>(
    !_.isEmpty(workspace.relativePerformances) &&
      hasNoEffects &&
      hasNoDistributions
  );

  const [
    scalesCalculationMethod,
    setScalesCalculationMethod
  ] = useState<TScalesCalculationMethod>('median');
  const [showPercentages, setShowPercentages] = useState<boolean>(true);

  const [displayMode, setDisplayMode] = useState<TDisplayMode>(
    getInitialDisplayMode(isRelativeProblem, hasNoEffects)
  );

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
  const [numberOfToggledColumns, setNumberOfToggledColumns] = useState<number>(
    5
  );

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
            getDisplayMode(isRelativeProblem, settings.displayMode)
          );
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
    updatedSettings: ISettings,
    updatedToggledColumns: IToggledColumns
  ): void {
    if (
      !_.isEqual(currentSettings, updatedSettings) ||
      !_.isEqual(currentToggledColumns, updatedToggledColumns)
    ) {
      setScalesCalculationMethod(updatedSettings.calculationMethod);
      setShowPercentages(updatedSettings.showPercentages === 'percentage');
      setDisplayMode(updatedSettings.displayMode);
      setRandomSeed(updatedSettings.randomSeed);
      setShowDescriptions(updatedToggledColumns.description);
      setShowUnitsOfMeasurement(updatedToggledColumns.units);
      setShowReferences(updatedToggledColumns.references);
      setShowStrengthsAndUncertainties(updatedToggledColumns.strength);
      setNumberOfToggledColumns(
        calculateNumberOfToggledColumns(updatedToggledColumns)
      );
      const settingsCommand: ISettingsMessage = {
        settings: {
          ...updatedSettings
        },
        toggledColumns: {...updatedToggledColumns}
      };
      axios
        .put(
          `/workspaces/${workspace.properties.id}/workspaceSettings`,
          settingsCommand
        )
        .then(() => {
          window.location.reload();
        })
        .catch(errorCallback);
    }
  }

  return (
    <SettingsContext.Provider
      value={{
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
        numberOfToggledColumns,
        updateSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
