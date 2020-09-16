import IWorkspaceSettings from '@shared/interface/IWorkspaceSettings';
import IProblem from '@shared/interface/Problem/IProblem';
import IScenario from '@shared/interface/Scenario/IScenario';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import Preferences from './Preferences/Preferences';
import {PreferencesContextProviderComponent} from './PreferencesContext';

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
