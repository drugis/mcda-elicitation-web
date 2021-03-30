import {Grid} from '@material-ui/core';
import {HelpContextProviderComponent} from 'help-popup';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {lexicon} from '../InlineHelp/lexicon';
import CreateWorkspace from './CreateWorkspace/CreateWorkspace';
import WorkspacesTables from './WorkspacesTables/WorkspacesTables';

export default function Workspaces(): JSX.Element {
  return (
    <ErrorContextProviderComponent>
      <ErrorHandler>
        <HelpContextProviderComponent
          lexicon={lexicon}
          host={'@MCDA_HOST'}
          path="/manual.html"
        >
          <Grid container>
            <CreateWorkspace />
            <WorkspacesTables />
          </Grid>
        </HelpContextProviderComponent>
      </ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
