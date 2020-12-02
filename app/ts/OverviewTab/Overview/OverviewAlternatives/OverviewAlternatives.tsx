import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';
import _ from 'lodash';
import OverviewAlternativeRow from './OverviewAlternativeRow/OverviewAlternativeRow';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';

export default function OverviewAlternatives(): JSX.Element {
  const {alternatives} = useContext(WorkspaceContext);

  function renderAlternativeRows(): JSX.Element[] {
    return _.map(alternatives, (alternative) => (
      <OverviewAlternativeRow alternative={alternative} key={alternative.id} />
    ));
  }

  return (
    <Grid item container xs={12}>
      <Grid item xs={12}>
        <Typography variant={'h5'}>
          Alternatives <InlineHelp helpId={'alternative'} />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Alternative title</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderAlternativeRows()}</TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}
