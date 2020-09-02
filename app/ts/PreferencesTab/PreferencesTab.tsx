import React from 'react';
import IScenario from '@shared/interface/Scenario/IScenario';
import {PreferencesContextProviderComponent} from './PreferencesContext';
import Preferences from './Preferences/Preferences';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';

export default function PreferencesTab({
  scenarios,
  workspaceId
}: {
  scenarios: IScenario[];
  workspaceId: string;
}) {
  return scenarios ? (
    <ErrorContextProviderComponent>
      <PreferencesContextProviderComponent
        scenarios={scenarios}
        workspaceId={workspaceId}
      >
        <Preferences />
      </PreferencesContextProviderComponent>
    </ErrorContextProviderComponent>
  ) : (
    <></>
  );
}
