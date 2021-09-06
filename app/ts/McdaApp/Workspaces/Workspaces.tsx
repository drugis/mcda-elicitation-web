import {Grid, Typography} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import CreateWorkspace from './CreateWorkspace/CreateWorkspace';
import InProgressWorkspacesTable from './InProgressWorkspacesTable/InProgressWorkspacesTable';
import {WorkspacesContextProviderComponent} from './WorkspacesContext/WorkspacesContext';
import WorkspacesFilter from './WorkspacesFilter/WorkspacesFilter';
import WorkspacesTable from './WorkspacesTable/WorkspacesTable';

export default function Workspaces(): JSX.Element {
  document.title = 'Workspaces';

  return (
    <WorkspacesContextProviderComponent>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <CreateWorkspace />
        </Grid>
        <Grid item xs={8}>
          <Typography id="workspaces-header" variant="h4">
            <InlineHelp helpId="workspace">Workspaces</InlineHelp>
          </Typography>
        </Grid>
        <Grid container item xs={8} spacing={1}>
          <Grid item xs={12}>
            <WorkspacesFilter />
          </Grid>
          <Grid item xs={12}>
            <WorkspacesTable />
          </Grid>
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
    </WorkspacesContextProviderComponent>
  );
}
