import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import React, {useContext} from 'react';
import ClipboardButton from '../ClipboardButton/ClipboardButton';
import InlineHelp from '../InlineHelp/InlineHelp';
import {WorkspaceContext} from '../Workspace/WorkspaceContext';
import EffectsTableCriteriaRows from './EffectsTableCriteriaRows/EffectsTableCriteriaRows';
import CriteriaHeader from './EffectsTableHeaders/CriteriaHeader/CriteriaHeader';
import DescriptionHeader from './EffectsTableHeaders/DescriptionHeader/DescriptionHeader';
import ReferencesHeader from './EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from './EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from './EffectsTableHeaders/UnitsHeader/UnitsHeader';

export default function EffectsTable() {
  const {alternatives, scales} = useContext(WorkspaceContext);

  function renderAlternativeHeaders(): JSX.Element[] {
    return _(alternatives).toPairs().map(createAlternativeHeader).value();
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
          <CriteriaHeader colSpan={1} />
          <DescriptionHeader />
          <UnitsHeader />
          {renderAlternativeHeaders()}
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
  ) : (
    <CircularProgress />
  );
}
