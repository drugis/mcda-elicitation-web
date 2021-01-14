import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, {useContext} from 'react';
import ClipboardButton from '../ClipboardButton/ClipboardButton';
import InlineHelp from '../InlineHelp/InlineHelp';
import {SubproblemContext} from '../Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContext} from '../Workspace/WorkspaceContext';
import EffectsTableAlternativeHeaders from './EffectsTableAlternativeHeaders/EffectsTableAlternativeHeaders';
import EffectsTableCriteriaRows from './EffectsTableCriteriaRows/EffectsTableCriteriaRows';
import CriteriaHeader from './EffectsTableHeaders/CriteriaHeader/CriteriaHeader';
import DescriptionHeader from './EffectsTableHeaders/DescriptionHeader/DescriptionHeader';
import ReferencesHeader from './EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from './EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from './EffectsTableHeaders/UnitsHeader/UnitsHeader';

export default function EffectsTable() {
  const {scales} = useContext(WorkspaceContext);
  const {filteredAlternatives} = useContext(SubproblemContext);

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
    <Grid container>
      <Grid item xs={9} id="effects-table-header">
        <Typography variant={'h5'}>
          Effects Table <InlineHelp helpId="effects-table" />
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
    <CircularProgress />
  );
}
