import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import ISettings from '@shared/interface/ISettings';
import IToggledColumns from '@shared/interface/IToggledColumns';
import _ from 'lodash';
import React from 'react';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import {EffectsTableContextProviderComponent} from './EffectsTableContext/EffectsTableContext';
import EffectsTableCriteriaRows from './EffectsTableCriteriaRows/EffectsTableCriteriaRows';

export default function EffectsTable({
  oldWorkspace,
  settings,
  scales,
  toggledColumns
}: {
  oldWorkspace: IOldWorkspace;
  settings: ISettings;
  scales: Record<string, Record<string, IScale>>;
  toggledColumns: IToggledColumns;
}) {
  function renderAlternativeHeaders(): JSX.Element[] {
    return _(oldWorkspace.problem.alternatives)
      .toPairs()
      .map(createAlternativeHeader)
      .value();
  }

  function createAlternativeHeader(
    [alternativeId, alternative]: [string, {title: string}],
    index: number
  ) {
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

  function renderTableHeaders(): JSX.Element {
    return (
      <TableHead>
        <TableRow>
          {renderCriteriaHeader()}
          {renderDescriptionHeader()}
          {renderUnitOfMeasurementHeader()}
          {renderAlternativeHeaders()}
          {renderStrengthAndUncertaintyHeader()}
          {renderReferenceHeader()}
        </TableRow>
      </TableHead>
    );
  }

  function renderCriteriaHeader(): JSX.Element {
    return (
      <TableCell id="column-criterion" align="center">
        Criterion
      </TableCell>
    );
  }

  function renderDescriptionHeader(): JSX.Element {
    if (toggledColumns.description) {
      return (
        <TableCell id="column-description" align="center">
          Description
        </TableCell>
      );
    } else {
      return <></>;
    }
  }

  function renderUnitOfMeasurementHeader(): JSX.Element {
    if (toggledColumns.units) {
      return (
        <TableCell id="column-unit-of-measurement" align="center">
          Unit of measurement
        </TableCell>
      );
    } else {
      return <></>;
    }
  }

  function renderStrengthAndUncertaintyHeader(): JSX.Element {
    if (toggledColumns.strength) {
      return (
        <TableCell align="center">
          Strength of evidence / Uncertainties
        </TableCell>
      );
    } else {
      return <></>;
    }
  }

  function renderReferenceHeader(): JSX.Element {
    if (toggledColumns.references) {
      return <TableCell align="center">Reference</TableCell>;
    } else {
      return <></>;
    }
  }

  return scales ? (
    <SettingsContextProviderComponent
      settings={settings}
      toggledColumns={toggledColumns}
    >
      <EffectsTableContextProviderComponent
        oldWorkspace={oldWorkspace}
        scales={scales}
      >
        <Grid container>
          <Grid item xs={12} id="effects-table-header">
            <h4>Effects Table</h4>
          </Grid>
          <Grid item xs={12}>
            <Table size="small">
              {renderTableHeaders()}
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
