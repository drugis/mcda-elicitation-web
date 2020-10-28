import ISettings from '@shared/interface/ISettings';
import IToggledColumns from '@shared/interface/IToggledColumns';
import IProblem from '@shared/interface/Problem/IProblem';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import React from 'react';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import Preferences from './Preferences/Preferences';
import {PreferencesContextProviderComponent} from './PreferencesContext';

export default function PreferencesTab({
  scenarios,
  currentScenarioId,
  workspaceId,
  problem,
  settings,
  updateAngularScenario,
  toggledColumns
}: {
  scenarios: IMcdaScenario[];
  currentScenarioId: string;
  workspaceId: string;
  problem: IProblem;
  settings: ISettings;
  updateAngularScenario: (scenario: IMcdaScenario) => void;
  toggledColumns: IToggledColumns;
}) {
  return scenarios && problem ? (
    <ErrorContextProviderComponent>
      <HelpContextProviderComponent>
        <SettingsContextProviderComponent
          settings={settings}
          toggledColumns={toggledColumns}
        >
          <PreferencesContextProviderComponent
            scenarios={scenarios}
            currentScenarioId={currentScenarioId}
            workspaceId={workspaceId}
            problem={problem}
            updateAngularScenario={updateAngularScenario}
          >
            <Preferences />
          </PreferencesContextProviderComponent>
        </SettingsContextProviderComponent>
      </HelpContextProviderComponent>
    </ErrorContextProviderComponent>
  ) : (
    <></>
  );
}
