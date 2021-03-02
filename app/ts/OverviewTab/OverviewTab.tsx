import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import {lexicon} from 'app/ts/InlineHelp/lexicon';
import {HelpContextProviderComponent} from 'help-popup';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {WorkspaceContextProviderComponent} from '../Workspace/WorkspaceContext';
import Overview from './Overview/Overview';

export default function OverviewTab({
  workspace,
  subproblems,
  currentSubproblem,
  workspaceId
}: {
  workspace: IOldWorkspace;
  subproblems: IOldSubproblem[];
  currentSubproblem: IOldSubproblem;
  workspaceId: string;
}) {
  return (
    <ErrorContextProviderComponent>
      <HelpContextProviderComponent lexicon={lexicon}>
        <WorkspaceContextProviderComponent
          oldWorkspace={workspace}
          oldSubproblems={subproblems}
          currentAngularSubproblem={currentSubproblem}
          workspaceId={workspaceId}
          subproblemChanged={() => {}}
        >
          <SettingsContextProviderComponent>
            <ErrorHandler>
              <Overview />
            </ErrorHandler>
          </SettingsContextProviderComponent>
        </WorkspaceContextProviderComponent>
      </HelpContextProviderComponent>
    </ErrorContextProviderComponent>
  );
}
