import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {CurrentSubproblemContext} from 'app/ts/Workspace/SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';

export default function RankAcceptabilitiesTable({
  ranks
}: {
  ranks: Record<string, number[]>;
}) {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

  return (
    <Table id="rank-acceptabilities-table">
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
                <TableCell
                  id={`rank-${alternative.id}-${rank}`}
                  key={alternative.id + rank}
                >
                  {significantDigits(valueForRank)}
                </TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
