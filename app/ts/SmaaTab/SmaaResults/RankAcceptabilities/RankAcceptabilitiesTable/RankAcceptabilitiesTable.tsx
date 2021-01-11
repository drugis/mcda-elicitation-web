import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import {SmaaResultsContext} from 'app/ts/SmaaTab/SmaaResultsContext/SmaaResultsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';

export default function RankAcceptabilitiesTable() {
  const {filteredAlternatives} = useContext(SubproblemContext);
  const {ranks} = useContext(SmaaResultsContext);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          {_.map(
            filteredAlternatives,
            (alternative: IAlternative, index: number) => (
              <TableCell key={alternative.id}>Rank {index + 1}</TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(filteredAlternatives, (alternative: IAlternative) => (
          <TableRow key={alternative.id}>
            <TableCell>{alternative.title}</TableCell>
            {_.map(
              ranks[alternative.id],
              (valueForRank: number, rank: number): JSX.Element => (
                <TableCell key={alternative.id + rank}>
                  {valueForRank}
                </TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
