import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import {getNextId, getPreviousId} from 'app/ts/util/swapUtil';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {WorkspaceContext} from '../../../WorkspaceContext/WorkspaceContext';
import OverviewAlternativeRow from './OverviewAlternativeRow/OverviewAlternativeRow';

export default function OverviewAlternatives(): JSX.Element {
  const {workspace} = useContext(WorkspaceContext);

  function renderAlternativeRows(): JSX.Element[] {
    return _.map(workspace.alternatives, renderAlternativeRow);
  }

  function renderAlternativeRow(
    alternative: IAlternative,
    index: number,
    alternativeArray: IAlternative[]
  ): JSX.Element {
    const nextId = getNextId(index, alternativeArray);
    const previousId = getPreviousId(index, alternativeArray);
    return (
      <OverviewAlternativeRow
        key={alternative.id}
        alternative={alternative}
        nextAlternativeId={nextId}
        previousAlternativeId={previousId}
      />
    );
  }

  return (
    <Grid item container xs={12} id="alternatives-container">
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="alternative">Alternatives </InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="100%">Alternative title</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderAlternativeRows()}</TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}
