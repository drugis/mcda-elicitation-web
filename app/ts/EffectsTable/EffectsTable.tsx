import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import ISettings from '@shared/interface/ISettings';
import _ from 'lodash';
import React from 'react';
import { SettingsContextProviderComponent } from '../Settings/SettingsContext';
import { EffectsTableContextProviderComponent } from './EffectsTableContext/EffectsTableContext';
import EffectsTableCriteriaRows from './EffectsTableCriteriaRows/EffectsTableCriteriaRows';

export default function EffectsTable({
  oldWorkspace,
  settings,
  scales
}: {
  oldWorkspace: IOldWorkspace;
  settings: ISettings;
  scales: Record<string, Record<string, IScale>>;
}) {
  function createAlternativeHeaders(): JSX.Element[] {
    return _.map(
      oldWorkspace.problem.alternatives,
      (alternative: {title:string}, alternativeId: string) => {
        return <TableCell key={alternativeId} align="center">{alternative.title}</TableCell>;
      }
    );
  }

  return (
    <SettingsContextProviderComponent settings={settings}>
    <EffectsTableContextProviderComponent oldWorkspace={oldWorkspace} scales={scales}>
      <Table id="effects-table" size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">Criterion</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Unit of measurement</TableCell>
            {createAlternativeHeaders()}
            <TableCell align="center">
              Strength of evidence / Uncertainties
            </TableCell>
            <TableCell align="center">Reference</TableCell>
          </TableRow>
        </TableHead>
        <EffectsTableCriteriaRows />
      </Table>
    </EffectsTableContextProviderComponent>
    </SettingsContextProviderComponent>
  );
}
