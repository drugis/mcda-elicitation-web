import IEditMode from '@shared/interface/IEditMode';
import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
import React from 'react';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import WorkspaceSettings from './WorkspaceSettings';

export default function WorkspaceSettingsWrapper({
  workspaceSettings,
  toggledColumns,
  editMode
}: {
  workspaceSettings: ISettings;
  toggledColumns: IToggledColumns;
  editMode: IEditMode;
}): JSX.Element {
  return (
    <SettingsContextProviderComponent
      settings={workspaceSettings}
      toggledColumns={toggledColumns}
    >
      <WorkspaceSettings editMode={editMode} />
    </SettingsContextProviderComponent>
  );
}
