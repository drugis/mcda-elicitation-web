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

  function getNextId<T extends {id: string}>(
    index: number,
    items: T[]
  ): string | undefined {
    return index < items.length - 1 ? items[index + 1].id : undefined;
  }

  function getPreviousId<T extends {id: string}>(
    index: number,
    items: T[]
  ): string | undefined {
    return index ? items[index - 1].id : undefined;
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
