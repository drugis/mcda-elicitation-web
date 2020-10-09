import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import ISettings from '@shared/interface/ISettings';
import IToggledColumns from '@shared/interface/IToggledColumns';
import React from 'react';
import EffectsTable from '../EffectsTable/EffectsTable';
import {ErrorContextProviderComponent} from '../Error/ErrorContext';
import ErrorHandler from '../Error/ErrorHandler';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import ScalesTable from './ScalesTable/ScalesTable';

export default function Subproblem({
  problem,
  scales,
  settings,
  toggledColumns
}: {
  problem: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
  settings: ISettings;
  toggledColumns: IToggledColumns;
}) {
  return (
    <ErrorContextProviderComponent>
      <HelpContextProviderComponent>
        <SettingsContextProviderComponent
          settings={settings}
          toggledColumns={toggledColumns}
        >
          <ErrorHandler>
            <EffectsTable
              oldWorkspace={problem}
              scales={scales}
              toggledColumns={toggledColumns}
            />
            <ScalesTable oldWorkspace={problem} scales={scales} />
          </ErrorHandler>
        </SettingsContextProviderComponent>
      </HelpContextProviderComponent>
    </ErrorContextProviderComponent>
  );
}
