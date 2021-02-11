import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {SubproblemContextProviderComponent} from '../Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContextProviderComponent} from '../Workspace/WorkspaceContext';
import Preferences from './Preferences/Preferences';
import {PreferencesContextProviderComponent} from './PreferencesContext';

export default function PreferencesTab({
  scenarios,
  currentScenarioId,
  workspaceId,
  updateAngularScenario,
  workspace,
  scales,
  subproblems,
  currentSubproblem
}: {
  scenarios: IMcdaScenario[];
  currentScenarioId: string;
  workspaceId: string;
  updateAngularScenario: (scenario: IMcdaScenario) => void;
  workspace: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
  subproblems: IOldSubproblem[];
  currentSubproblem: IOldSubproblem;
}) {
  return scenarios && workspace ? (
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
          <SubproblemContextProviderComponent>
            <SettingsContextProviderComponent>
              <PreferencesContextProviderComponent
                scenarios={scenarios}
                currentScenarioId={currentScenarioId}
                workspaceId={workspaceId}
                updateAngularScenario={updateAngularScenario}
              >
                <ErrorHandler>
                  <Preferences />
                </ErrorHandler>
              </PreferencesContextProviderComponent>
            </SettingsContextProviderComponent>
          </SubproblemContextProviderComponent>
        </WorkspaceContextProviderComponent>
      </HelpContextProviderComponent>
    </ErrorContextProviderComponent>
  ) : (
    <></>
  );
}
