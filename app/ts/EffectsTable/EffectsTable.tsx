import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {InlineHelp} from 'help-popup';
import React, {useContext} from 'react';
import ClipboardButton from '../ClipboardButton/ClipboardButton';
import {CurrentSubproblemContext} from '../McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {WorkspaceContext} from '../McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import EffectsTableAlternativeHeaders from './EffectsTableAlternativeHeaders/EffectsTableAlternativeHeaders';
import EffectsTableCriteriaRows from './EffectsTableCriteriaRows/EffectsTableCriteriaRows';
import CriteriaHeader from './EffectsTableHeaders/CriteriaHeader/CriteriaHeader';
import DescriptionHeader from './EffectsTableHeaders/DescriptionHeader/DescriptionHeader';
import ReferencesHeader from './EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from './EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from './EffectsTableHeaders/UnitsHeader/UnitsHeader';

export default function EffectsTable() {
  const {scales} = useContext(WorkspaceContext);
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

  function renderTableHeaders(): JSX.Element {
    return (
      <TableHead>
        <TableRow>
          <CriteriaHeader colSpan={1} />
          <DescriptionHeader />
          <UnitsHeader />
          <EffectsTableAlternativeHeaders alternatives={filteredAlternatives} />
          <SoEUncHeader />
          <ReferencesHeader />
        </TableRow>
      </TableHead>
    );
  }

  return scales ? (
    <Grid container item xs={12}>
      <Grid item xs={9} id="effects-table-header">
        <Typography variant="h5">
          <InlineHelp helpId="effects-table">Effects Table</InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={3} justify="flex-end">
        <ClipboardButton targetId="#effects-table" />
      </Grid>
      <Grid item xs={12}>
        <Table size="small" id="effects-table">
          {renderTableHeaders()}
          <EffectsTableCriteriaRows />
        </Table>
      </Grid>
    </Grid>
  ) : (
    <Grid item xs={12}>
      <CircularProgress />
    </Grid>
  );
}
