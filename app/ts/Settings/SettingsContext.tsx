import ICriterion from '@shared/interface/ICriterion';
import {OurError} from '@shared/interface/IError';
import ISettings from '@shared/interface/Settings/ISettings';
import ISettingsMessage from '@shared/interface/Settings/ISettingsMessage';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {canBePercentage} from '../DisplayUtil/DisplayUtil';
import {ErrorContext} from '../Error/ErrorContext';
import {WorkspaceContext} from '../Workspace/WorkspaceContext';
import ISettingsContext from './ISettingsContext';
import {
  calculateNumberOfToggledColumns,
  getDefaultSettings
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

  const [numberOfToggledColumns, setNumberOfToggledColumns] = useState<number>(
    5
  );
  const {defaultSettings, defaultToggledColumns} = getDefaultSettings(
    isRelativeProblem,
    hasNoEffects
  );
  const [settings, setSettings] = useState<ISettings>(defaultSettings);
  const [toggledColumns, setToggledColumns] = useState<IToggledColumns>(
    defaultToggledColumns
  );

  useEffect(() => {
    axios
      .get(`/workspaces/${workspace.properties.id}/workspaceSettings`)
      .then((response: AxiosResponse<ISettingsMessage>) => {
        const incomingSettings: ISettings = response.data.settings;
        const incomingToggledColumns: IToggledColumns =
          response.data.toggledColumns;
        if (!_.isEmpty(incomingSettings)) {
          setSettings(incomingSettings);
          setToggledColumns(incomingToggledColumns);
          setNumberOfToggledColumns(
            calculateNumberOfToggledColumns(incomingToggledColumns)
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
      !_.isEqual(settings, updatedSettings) ||
      !_.isEqual(toggledColumns, updatedToggledColumns)
    ) {
      setSettings(updatedSettings);
      setToggledColumns(updatedToggledColumns);
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

  function getUsePercentage(criterion: ICriterion): boolean {
    return (
      settings.showPercentages === 'percentage' &&
      canBePercentage(criterion.dataSources[0].unitOfMeasurement.type)
    );
  }

  return (
    <SettingsContext.Provider
      value={{
        hasNoEffects,
        hasNoDistributions,
        isRelativeProblem,
        numberOfToggledColumns,
        settings,
        showPercentages: settings.showPercentages === 'percentage',
        toggledColumns,
        getUsePercentage,
        updateSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
