import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CriteriaHeader from 'app/ts/EffectsTable/EffectsTableHeaders/CriteriaHeader/CriteriaHeader';
import DescriptionHeader from 'app/ts/EffectsTable/EffectsTableHeaders/DescriptionHeader/DescriptionHeader';
import ReferencesHeader from 'app/ts/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from 'app/ts/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from 'app/ts/EffectsTable/EffectsTableHeaders/UnitsHeader/UnitsHeader';
import DisplayWarnings from 'app/ts/util/DisplayWarnings';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {AddSubproblemContext} from '../AddSubproblemContext';
import AddSubproblemEffectsTableAlternativeHeader from './AddSubproblemEffectsTableAlternativeHeader/AddSubproblemEffectsTableAlternativeHeader';
import AddSubproblemEffectsTableCriteriaRows from './AddSubproblemEffectsTableCriteriaRows/AddSubproblemEffectsTableCriteriaRows';

export default function AddSubproblemEffectsTable() {
  const {alternatives} = useContext(WorkspaceContext);
  const {missingValueWarnings} = useContext(AddSubproblemContext);

  function renderTableHeaders(): JSX.Element {
    return (
      <TableHead>
        <TableRow>
          <CriteriaHeader colSpan={2} />
          <DescriptionHeader />
          <TableCell />
          <UnitsHeader />
          {renderAlternativeHeaders()}
          <SoEUncHeader />
          <ReferencesHeader />
        </TableRow>
      </TableHead>
    );
  }

  function renderAlternativeHeaders(): JSX.Element[] {
    return _.map(alternatives, (alternative) => {
      return (
        <AddSubproblemEffectsTableAlternativeHeader
          key={alternative.id}
          alternative={alternative}
        />
      );
    });
  }

  return (
    <Grid container>
      <Grid item xs={12} id="effects-table-header">
        <Typography variant={'h5'}>
          <InlineHelp helpId="effects-table">Effects Table</InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Table size="small" id="effects-table">
          {renderTableHeaders()}
          <AddSubproblemEffectsTableCriteriaRows />
        </Table>
      </Grid>
      <Grid item xs={12}>
        <DisplayWarnings
          warnings={missingValueWarnings}
          identifier="effects-table"
        />
      </Grid>
    </Grid>
  );
}
