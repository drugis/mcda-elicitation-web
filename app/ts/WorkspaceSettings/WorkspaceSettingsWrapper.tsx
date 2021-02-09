import IEditMode from '@shared/interface/IEditMode';
import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
import React from 'react';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import WorkspaceSettings from './WorkspaceSettings';

export default function WorkspaceSettingsWrapper({
  workspaceSettings,
  toggledColumns,
  editMode,
  updateAngularSettings
}: {
  workspaceSettings: ISettings;
  toggledColumns: IToggledColumns;
  editMode: IEditMode;
  updateAngularSettings: (
    settings: ISettings,
    toggledColumns: IToggledColumns
  ) => void;
}): JSX.Element {
  return (
    <SettingsContextProviderComponent
      settings={workspaceSettings}
      toggledColumns={toggledColumns}
      updateAngularSettings={updateAngularSettings}
    >
      <WorkspaceSettings editMode={editMode} />
    </SettingsContextProviderComponent>
  );
}
