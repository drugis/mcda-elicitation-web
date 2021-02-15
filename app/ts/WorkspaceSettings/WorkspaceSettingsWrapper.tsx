import {Grid} from '@material-ui/core';
import IEditMode from '@shared/interface/IEditMode';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {WorkspaceContextProviderComponent} from '../Workspace/WorkspaceContext';
import WorkspaceSettings from './WorkspaceSettings';

export default function WorkspaceSettingsWrapper({
  editMode,
  workspace
}: {
  editMode: IEditMode;
  workspace: IOldWorkspace;
}): JSX.Element {
  return (
    <ErrorContextProviderComponent>
      <WorkspaceContextProviderComponent
        oldWorkspace={workspace}
        oldSubproblems={[]}
        currentAngularSubproblem={{} as IOldSubproblem}
        workspaceId={workspace.id}
        subproblemChanged={() => {}}
      >
        <SettingsContextProviderComponent>
          <Grid container justify="flex-end">
            <WorkspaceSettings editMode={editMode} />
          </Grid>
        </SettingsContextProviderComponent>
      </WorkspaceContextProviderComponent>
    </ErrorContextProviderComponent>
  );
}
