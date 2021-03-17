import {HelpContextProviderComponent} from 'help-popup';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {lexicon} from '../InlineHelp/lexicon';
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
          <WorkspacesTables />
        </HelpContextProviderComponent>
      </ErrorHandler>
    </ErrorContextProviderComponent>
  );
}
