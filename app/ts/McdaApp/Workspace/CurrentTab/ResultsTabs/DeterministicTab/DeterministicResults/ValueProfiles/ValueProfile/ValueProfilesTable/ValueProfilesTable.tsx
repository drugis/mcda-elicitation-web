import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import significantDigits from 'app/ts/McdaApp/ManualInput/Util/significantDigits';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';

export default function ValueProfilesTable({
  valueProfiles
}: {
  valueProfiles: Record<string, Record<string, number>>;
}): JSX.Element {
  const {filteredAlternatives, filteredCriteria} = useContext(
    CurrentSubproblemContext
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          {_.map(
            filteredAlternatives,
            (alternative: IAlternative): JSX.Element => (
              <TableCell key={alternative.id}>{alternative.title}</TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(
          filteredCriteria,
          (criterion: ICriterion): JSX.Element => (
            <TableRow key={criterion.id}>
              <TableCell>{criterion.title}</TableCell>
              {_.map(filteredAlternatives, (alternative: IAlternative) => (
                <TableCell key={alternative.id}>
                  {significantDigits(
                    valueProfiles[alternative.id][criterion.id]
                  )}
                </TableCell>
              ))}
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}
