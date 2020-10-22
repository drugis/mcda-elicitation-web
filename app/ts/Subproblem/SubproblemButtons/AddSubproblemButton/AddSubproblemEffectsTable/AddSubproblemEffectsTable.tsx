import {
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import CriteriaHeader from 'app/ts/EffectsTable/EffectsTableHeaders/CriteriaHeader/CriteriaHeader';
import DescriptionHeader from 'app/ts/EffectsTable/EffectsTableHeaders/DescriptionHeader/DescriptionHeader';
import ReferencesHeader from 'app/ts/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from 'app/ts/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from 'app/ts/EffectsTable/EffectsTableHeaders/UnitsHeader/UnitsHeader';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import AddSubproblemEffectsTableAlternativeHeader from './AddSubproblemEffectsTableAlternativeHeader/AddSubproblemEffectsTableAlternativeHeader';
import AddSubproblemEffectsTableCriteriaRows from './AddSubproblemEffectsTableCriteriaRows/AddSubproblemEffectsTableCriteriaRows';

export const deselectedCellStyle = {backgroundColor: '#e9e9e9'};

export default function AddSubproblemEffectsTable() {
  const {alternatives} = useContext(WorkspaceContext);

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
          Effects Table <InlineHelp helpId="effects-table" />
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Table size="small" id="effects-table">
          {renderTableHeaders()}
          <AddSubproblemEffectsTableCriteriaRows />
        </Table>
      </Grid>
    </Grid>
  );
}
