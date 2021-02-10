import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
import React from 'react';
import EffectsTable from '../EffectsTable/EffectsTable';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {SubproblemContextProviderComponent} from '../Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContextProviderComponent} from '../Workspace/WorkspaceContext';
import ScaleRanges from './ScaleRanges/ScaleRanges';
import SubproblemButtons from './SubproblemButtons/SubproblemButtons';
import SubproblemSelection from './SubproblemSelection/SubproblemSelection';

export default function Subproblem({
  workspace,
  scales,
  settings,
  toggledColumns,
  subproblems,
  currentSubproblem,
  subproblemChanged,
  workspaceId
}: {
  workspace: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
  settings: ISettings;
  toggledColumns: IToggledColumns;
  subproblems: IOldSubproblem[];
  currentSubproblem: IOldSubproblem;
  subproblemChanged: (subproblem: IOldSubproblem) => void;
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
          subproblemChanged={subproblemChanged}
          scales={scales}
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
