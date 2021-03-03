import IEditMode from '@shared/interface/IEditMode';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {HelpContextProviderComponent} from 'help-popup';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {lexicon} from '../InlineHelp/lexicon';
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
      <HelpContextProviderComponent
        lexicon={lexicon}
        host={'@MCDA_HOST'}
        path="/manual.html"
      >
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
