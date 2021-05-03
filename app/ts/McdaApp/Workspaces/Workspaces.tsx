import {Grid} from '@material-ui/core';
import React from 'react';
import CreateWorkspace from './CreateWorkspace/CreateWorkspace';
import WorkspacesTables from './WorkspacesTables/WorkspacesTables';

export default function Workspaces(): JSX.Element {
  document.title = 'Workspaces';

  return (
    <Grid container>
      <CreateWorkspace />
      <WorkspacesTables />
    </Grid>
  );
}
