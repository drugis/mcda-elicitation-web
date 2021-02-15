import ISettings from '@shared/interface/Settings/ISettings';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getDefaultSettings} from 'app/ts/Settings/SettingsUtil';
import React, {createContext, useContext, useEffect, useState} from 'react';
import IWorkspaceSettingsContext, {
  TSettings,
  TTogglableColumns
} from './IWorkspaceSettingsContext';

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
    isRelativeProblem,
    hasNoEffects,
    settings,
    toggledColumns,
    updateSettings
  } = useContext(SettingsContext);

  const [localSettings, setLocalSettings] = useState<ISettings>(settings);
  const [
    localToggledColumns,
    setLocalToggledColumns
  ] = useState<IToggledColumns>(toggledColumns);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (isDialogOpen) {
      setIsSaveButtonDisabled(false);
      setSettings(settings, toggledColumns);
    }
  }, [isDialogOpen]);

  function setSettings(
    newSettings: ISettings,
    newToggledColumns: IToggledColumns
  ): void {
    setLocalSettings(newSettings);
    setLocalToggledColumns(newToggledColumns);
  }

  function saveSettings(): void {
    updateSettings(localSettings, localToggledColumns);
  }

  function resetToDefaults() {
    const {defaultSettings, defaultToggledColumns} = getDefaultSettings(
      isRelativeProblem,
      hasNoEffects
    );
    setSettings(defaultSettings, defaultToggledColumns);
    setIsSaveButtonDisabled(false);
  }

  function setShowColumn(column: TTogglableColumns, value: boolean): void {
    setLocalToggledColumns({...localToggledColumns, [column]: value});
  }

  function setSetting(setting: TSettings, value: any): void {
    setLocalSettings({...localSettings, [setting]: value});
  }

  function setAllColumnsTo(value: boolean): void {
    setLocalToggledColumns({
      units: value,
      strength: value,
      references: value,
      description: value
    });
  }

  return (
    <WorkspaceSettingsContext.Provider
      value={{
        isSaveButtonDisabled,
        localSettings,
        localToggledColumns,
        resetToDefaults,
        saveSettings,
        setSetting,
        setShowColumn,
        setAllColumnsTo,
        setIsSaveButtonDisabled
      }}
    >
      {children}
    </WorkspaceSettingsContext.Provider>
  );
}
