import IEditMode from '@shared/interface/IEditMode';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import {LegendContextProviderComponent} from '../Legend/LegendContext';
import {PreferencesContextProviderComponent} from '../PreferencesTab/PreferencesContext';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {SubproblemContextProviderComponent} from '../Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContextProviderComponent} from '../Workspace/WorkspaceContext';
import DeterministicResults from './DeterministicResults/DeterministicResults';
import {DeterministicResultsContextProviderComponent} from './DeterministicResultsContext/DeterministicResultsContext';

export default function DeterministicTab({
  scenarios,
  currentScenarioId,
  workspaceId,
  updateAngularScenario,
  workspace,
  subproblems,
  currentSubproblem,
  editMode
}: {
  scenarios: IMcdaScenario[];
  currentScenarioId: string;
  workspaceId: string;
  updateAngularScenario: (scenario: IMcdaScenario) => void;
  workspace: IOldWorkspace;
  subproblems: IOldSubproblem[];
  currentSubproblem: IOldSubproblem;
  editMode: IEditMode;
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
        >
          <SubproblemContextProviderComponent>
            <SettingsContextProviderComponent>
              <PreferencesContextProviderComponent
                scenarios={scenarios}
                currentScenarioId={currentScenarioId}
                workspaceId={workspaceId}
                updateAngularScenario={updateAngularScenario}
              >
                <LegendContextProviderComponent canEdit={editMode.canEdit}>
                  <DeterministicResultsContextProviderComponent>
                    <ErrorHandler>
                      <DeterministicResults />
                    </ErrorHandler>
                  </DeterministicResultsContextProviderComponent>
                </LegendContextProviderComponent>
              </PreferencesContextProviderComponent>
            </SettingsContextProviderComponent>
          </SubproblemContextProviderComponent>
        </WorkspaceContextProviderComponent>
      </HelpContextProviderComponent>
    </ErrorContextProviderComponent>
  );
}
