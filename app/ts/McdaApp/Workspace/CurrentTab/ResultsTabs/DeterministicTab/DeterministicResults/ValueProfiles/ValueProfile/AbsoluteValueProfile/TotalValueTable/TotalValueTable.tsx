import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import React from 'react';

export default function TotalValueTable({
  alternatives,
  totalValues,
  isRelative = false
}: {
  alternatives: IAlternative[];
  totalValues: Record<string, number>;
  isRelative?: boolean;
}): JSX.Element {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {_.map(alternatives, (alternative: IAlternative) => (
            <TableCell key={alternative.id}>{alternative.title}</TableCell>
          ))}
          <ShowIf condition={isRelative}>
            <TableCell>Difference</TableCell>
          </ShowIf>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {_.map(alternatives, (alternative: IAlternative) => (
            <TableCell key={alternative.id}>
              {significantDigits(totalValues[alternative.id])}
            </TableCell>
          ))}
          <ShowIf condition={isRelative}>
            <TableCell id="relative-total-difference">
              {significantDigits(
                totalValues[alternatives[0].id] -
                  totalValues[alternatives[1].id]
              )}
            </TableCell>
          </ShowIf>
        </TableRow>
      </TableBody>
    </Table>
  );
}
