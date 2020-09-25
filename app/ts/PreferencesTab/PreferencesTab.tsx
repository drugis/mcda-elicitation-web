import IWorkspaceSettings from '@shared/interface/IWorkspaceSettings';
import IProblem from '@shared/interface/Problem/IProblem';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import Preferences from './Preferences/Preferences';
import {PreferencesContextProviderComponent} from './PreferencesContext';

export default function PreferencesTab({
  scenarios,
  currentScenarioId,
  workspaceId,
  problem,
  settings,
  updateAngularScenario
}: {
  scenarios: IMcdaScenario[];
  currentScenarioId: string;
  workspaceId: string;
  problem: IProblem;
  settings: IWorkspaceSettings;
  updateAngularScenario: (scenario: IMcdaScenario) => void;
}) {
  return scenarios && problem ? (
    <ErrorContextProviderComponent>
      <HelpContextProviderComponent>
        <PreferencesContextProviderComponent
          scenarios={scenarios}
          currentScenarioId={currentScenarioId}
          workspaceId={workspaceId}
          problem={problem}
          settings={settings}
          updateAngularScenario={updateAngularScenario}
        >
          <Preferences />
        </PreferencesContextProviderComponent>
      </HelpContextProviderComponent>
    </ErrorContextProviderComponent>
  ) : (
    <></>
  );
}
