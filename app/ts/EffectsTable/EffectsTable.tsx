import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import ISettings from '@shared/interface/ISettings';
import _ from 'lodash';
import React from 'react';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {EffectsTableContextProviderComponent} from './EffectsTableContext/EffectsTableContext';
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
    return _(oldWorkspace.problem.alternatives)
      .toPairs()
      .map(
        (
          [alternativeId, alternative]: [string, {title: string}],
          index: number
        ) => {
          return (
            <TableCell
              id={`column-alternative-${index}`}
              key={alternativeId}
              align="center"
            >
              {alternative.title}
            </TableCell>
          );
        }
      )
      .value();
  }

  return scales ? (
    <SettingsContextProviderComponent settings={settings}>
      <EffectsTableContextProviderComponent
        oldWorkspace={oldWorkspace}
        scales={scales}
      >
        <Grid container>
          <Grid item id="effects-table-header">
            <h4>Effects Table</h4>
          </Grid>
          <Grid item>
            <Table id="effectstable" size="small">
              <TableHead>
                <TableRow>
                  <TableCell id="column-criterion" align="center">
                    Criterion
                  </TableCell>
                  <TableCell id="column-description" align="center">
                    Description
                  </TableCell>
                  <TableCell id="column-unit-of-measurement" align="center">
                    Unit of measurement
                  </TableCell>
                  {createAlternativeHeaders()}
                  <TableCell align="center">
                    Strength of evidence / Uncertainties
                  </TableCell>
                  <TableCell align="center">Reference</TableCell>
                </TableRow>
              </TableHead>
              <EffectsTableCriteriaRows />
            </Table>
          </Grid>
        </Grid>
      </EffectsTableContextProviderComponent>
    </SettingsContextProviderComponent>
  ) : (
    <CircularProgress />
  );
}
