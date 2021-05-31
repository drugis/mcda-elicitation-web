import {Grid, Typography} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import React from 'react';
import CreateWorkspace from './CreateWorkspace/CreateWorkspace';
import InProgressWorkspacesTable from './InProgressWorkspacesTable/InProgressWorkspacesTable';
import {WorkspacesContextProviderComponent} from './WorkspacesContext/WorkspacesContext';
import WorkspacesFilter from './WorkspacesFilter/WorkspacesFilter';
import WorkspacesTable from './WorkspacesTable/WorkspacesTable';

export default function Workspaces(): JSX.Element {
  document.title = 'Workspaces';

  return (
    <Grid container spacing={1}>
      <CreateWorkspace />
      <Grid item xs={8}>
        <Typography id="workspaces-header" variant="h4">
          <InlineHelp helpId="workspace">Workspaces</InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={8} spacing={1}>
        <WorkspacesContextProviderComponent>
          <Grid item xs={12}>
            <WorkspacesFilter />
          </Grid>
          <Grid item xs={12}>
            <WorkspacesTable />
          </Grid>
        </WorkspacesContextProviderComponent>
      </Grid>
      <Grid item xs={8}>
        <Typography id="workspaces-header" variant="h4">
          <InlineHelp helpId="incomplete-workspaces">
            Unfinished workspaces
          </InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <InProgressWorkspacesTable />
      </Grid>
    </Grid>
  );
}
