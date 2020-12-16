import {Grid} from '@material-ui/core';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import WorkspacesTable from './WorkspacesTable/WorkspacesTable';

export default function Workspaces(): JSX.Element {
  return (
    <ErrorContextProviderComponent>
      <ErrorHandler>
        <Grid container>
          <WorkspacesTable />
        </Grid>
      </ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
