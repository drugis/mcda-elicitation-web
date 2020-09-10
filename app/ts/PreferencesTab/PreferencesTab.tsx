import React from 'react';
import IScenario from '@shared/interface/Scenario/IScenario';
import {PreferencesContextProviderComponent} from './PreferencesContext';
import Preferences from './Preferences/Preferences';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import IProblem from '@shared/interface/Problem/IProblem';
import IWorkspaceSettings from '@shared/interface/IWorkspaceSettings';

export default function PreferencesTab({
  scenarios,
  currentScenarioId,
  workspaceId,
  problem,
  settings
}: {
  scenarios: IScenario[];
  currentScenarioId: string;
  workspaceId: string;
  problem: IProblem;
  settings: IWorkspaceSettings;
}) {
  return scenarios && problem ? (
    <ErrorContextProviderComponent>
      <PreferencesContextProviderComponent
        scenarios={scenarios}
        currentScenarioId={currentScenarioId}
        workspaceId={workspaceId}
        problem={problem}
        settings={settings}
      >
        <Preferences />
      </PreferencesContextProviderComponent>
    </ErrorContextProviderComponent>
  ) : (
    <></>
  );
}
