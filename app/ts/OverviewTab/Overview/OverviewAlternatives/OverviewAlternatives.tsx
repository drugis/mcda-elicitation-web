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
import IAlternative from '@shared/interface/IAlternative';
import {getNextId, getPreviousId} from 'app/ts/util/swapUtil';

export default function OverviewAlternatives(): JSX.Element {
  const {alternatives} = useContext(WorkspaceContext);

  function renderAlternativeRows(): JSX.Element[] {
    return _(alternatives).values().map(renderAlternativeRow).value();
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
    <Grid item container xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Alternatives <InlineHelp helpId="alternative" />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell width="100%">Alternative title</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderAlternativeRows()}</TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}
