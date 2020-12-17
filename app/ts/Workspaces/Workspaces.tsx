import {Grid} from '@material-ui/core';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import WorkspacesTable from './WorkspacesTable/WorkspacesTable';

export default function Workspaces(): JSX.Element {
  return (
    <ErrorContextProviderComponent>
      <ErrorHandler>
        <HelpContextProviderComponent>
          <Grid container>
            <WorkspacesTable />
          </Grid>
        </HelpContextProviderComponent>
      </ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
