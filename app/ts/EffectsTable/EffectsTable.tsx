import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import IToggledColumns from '@shared/interface/IToggledColumns';
import _ from 'lodash';
import React from 'react';
import ClipboardButton from '../ClipboardButton/ClipboardButton';
import InlineHelp from '../InlineHelp/InlineHelp';
import {EffectsTableContextProviderComponent} from './EffectsTableContext/EffectsTableContext';
import EffectsTableCriteriaRows from './EffectsTableCriteriaRows/EffectsTableCriteriaRows';

export default function EffectsTable({
  oldWorkspace,
  scales,
  toggledColumns
}: {
  oldWorkspace: IOldWorkspace;
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
        Criterion <InlineHelp helpId="criterion" />
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
          Unit of measurement <InlineHelp helpId="unit-of-measurement" />
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
          Strength of evidence <InlineHelp helpId="strength-of-evidence" /> and
          Uncertainties <InlineHelp helpId="uncertainties" />
        </TableCell>
      );
    } else {
      return <></>;
    }
  }

  function renderReferenceHeader(): JSX.Element {
    if (toggledColumns.references) {
      return (
        <TableCell align="center">
          Reference <InlineHelp helpId="reference" />
        </TableCell>
      );
    } else {
      return <></>;
    }
  }

  return scales ? (
    <EffectsTableContextProviderComponent
      oldWorkspace={oldWorkspace}
      scales={scales}
    >
      <Grid container>
        <Grid item xs={9} id="effects-table-header">
          <Typography variant={'h5'}>
            Effects Table <InlineHelp helpId="effects-table" />
          </Typography>
        </Grid>
        <Grid item container xs={3} justify="flex-end">
          <ClipboardButton targetId="#effects-table" />
        </Grid>
        <Grid item xs={12}>
          <Table size="small" id="effects-table">
            {renderTableHeaders()}
            <EffectsTableCriteriaRows />
          </Table>
        </Grid>
      </Grid>
    </EffectsTableContextProviderComponent>
  ) : (
    <CircularProgress />
  );
}
