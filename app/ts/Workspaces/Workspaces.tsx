import {Grid} from '@material-ui/core';
import {HelpContextProviderComponent} from 'help-popup';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {lexicon} from '../InlineHelp/lexicon';
import WorkspacesTable from './WorkspacesTable/WorkspacesTable';

export default function Workspaces(): JSX.Element {
  return (
    <ErrorContextProviderComponent>
      <ErrorHandler>
        <HelpContextProviderComponent lexicon={lexicon}>
          <Grid container>
            <WorkspacesTable />
          </Grid>
        </HelpContextProviderComponent>
      </ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
