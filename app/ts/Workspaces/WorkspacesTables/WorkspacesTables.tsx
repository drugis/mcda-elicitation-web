import {Grid, Typography} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import axios, {AxiosResponse} from 'axios';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import WorkspacesTable from './WorkspacesTable/WorkspacesTable';

export default function WorkspacesTables(): JSX.Element {
  const {setError} = useContext(ErrorContext);
  const [workspaces, setWorkspaces] = useState<IOldWorkspace[]>([]);
  const [inProgressworkspaces, setInProgressWorkspaces] = useState<
    IInProgressWorkspaceProperties[]
  >([]);

  useEffect(() => {
    axios
      .get('/workspaces/')
      .then((result: AxiosResponse<IOldWorkspace[]>) => {
        setWorkspaces(_.sortBy(result.data, ['title']));
      })
      .catch(setError);

    axios
      .get('/api/v2/inProgress/')
      .then((result: AxiosResponse<IInProgressWorkspaceProperties[]>) => {
        setInProgressWorkspaces(_.sortBy(result.data, ['title']));
      })
      .catch(setError);
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid item xs={8}>
          <Typography id="workspaces-header" variant="h4">
            <InlineHelp helpId="workspace">Workspaces</InlineHelp>
          </Typography>
        </Grid>
      </Grid>
      <WorkspacesTable workspaces={workspaces} type="finished" />

      <Grid item xs={12}>
        <Grid item xs={8}>
          <Typography id="workspaces-header" variant="h4">
            <InlineHelp helpId="incomplete-workspaces">
              Unfinished workspaces
            </InlineHelp>
          </Typography>
        </Grid>
      </Grid>
      <WorkspacesTable workspaces={inProgressworkspaces} type="inProgress" />
    </Grid>
  );
}
