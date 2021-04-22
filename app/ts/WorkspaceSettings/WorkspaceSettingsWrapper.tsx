import {Grid} from '@material-ui/core';
import IEditMode from '@shared/interface/IEditMode';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import React from 'react';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import WorkspaceSettings from './WorkspaceSettings';

export default function WorkspaceSettingsWrapper({
  editMode,
  workspace
}: {
  editMode: IEditMode;
  workspace: IOldWorkspace;
}): JSX.Element {
  return (
    <SettingsContextProviderComponent>
      <Grid container justify="flex-end">
        <WorkspaceSettings editMode={editMode} />
      </Grid>
    </SettingsContextProviderComponent>
  );
}
