import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import {HelpContextProviderComponent} from 'help-popup';
import React from 'react';
import EffectsTable from '../EffectsTable/EffectsTable';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {lexicon} from '../InlineHelp/lexicon';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {SubproblemContextProviderComponent} from '../Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContextProviderComponent} from '../Workspace/WorkspaceContext';
import ScaleRanges from './ScaleRanges/ScaleRanges';
import SubproblemButtons from './SubproblemButtons/SubproblemButtons';
import SubproblemSelection from './SubproblemSelection/SubproblemSelection';

export default function Subproblem({
  workspace,
  subproblems,
  currentSubproblem,
  subproblemChanged,
  workspaceId
}: {
  workspace: IOldWorkspace;
  subproblems: IOldSubproblem[];
  currentSubproblem: IOldSubproblem;
  subproblemChanged: (subproblem: IOldSubproblem) => void;
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
          subproblemChanged={subproblemChanged}
        >
          <SubproblemContextProviderComponent>
            <SettingsContextProviderComponent>
              <ErrorHandler>
                <SubproblemSelection subproblemChanged={subproblemChanged} />
                <SubproblemButtons />
                <EffectsTable />
                <ScaleRanges />
              </ErrorHandler>
            </SettingsContextProviderComponent>
          </SubproblemContextProviderComponent>
        </WorkspaceContextProviderComponent>
      </HelpContextProviderComponent>
    </ErrorContextProviderComponent>
  );
}
