import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {WorkspaceContextProviderComponent} from '../Workspace/WorkspaceContext';
import Overview from './Overview/Overview';

export default function OverviewTab({
  workspace,
  scales,
  subproblems,
  currentSubproblem,
  workspaceId
}: {
  workspace: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
  subproblems: IOldSubproblem[];
  currentSubproblem: IOldSubproblem;
  workspaceId: string;
}) {
  return (
    <ErrorContextProviderComponent>
      <HelpContextProviderComponent>
        <WorkspaceContextProviderComponent
          oldWorkspace={workspace}
          oldSubproblems={subproblems}
          currentAngularSubproblem={currentSubproblem}
          workspaceId={workspaceId}
          subproblemChanged={() => {}}
          scales={scales}
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
