import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';

export default function TotalValueTable({
  totalValues
}: {
  totalValues: Record<string, number>;
}): JSX.Element {
  const {filteredAlternatives} = useContext(SubproblemContext);

  return (
    <Table>
      <TableHead>
        <TableRow>
          {_.map(filteredAlternatives, (alternative: IAlternative) => (
            <TableCell key={alternative.id}>{alternative.title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {_.map(filteredAlternatives, (alternative: IAlternative) => (
            <TableCell key={alternative.id}>
              {significantDigits(totalValues[alternative.id])}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
