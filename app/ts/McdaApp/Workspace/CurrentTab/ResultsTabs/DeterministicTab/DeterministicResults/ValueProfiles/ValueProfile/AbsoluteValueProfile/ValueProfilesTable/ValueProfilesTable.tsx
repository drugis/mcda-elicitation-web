import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import {useContext} from 'react';
import {calcImportances} from '../../../../../DeterministicResultsUtil';

export default function ValueProfilesTable({
  alternatives,
  valueProfiles,
  isRelative = false
}: {
  alternatives: IAlternative[];
  valueProfiles: Record<string, Record<string, number>>;
  isRelative?: boolean;
}): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const importances = calcImportances(valueProfiles, alternatives);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          {_.map(
            alternatives,
            (alternative: IAlternative): JSX.Element => (
              <TableCell key={alternative.id}>{alternative.title}</TableCell>
            )
          )}
          <ShowIf condition={isRelative}>
            <TableCell>Difference</TableCell>
            <TableCell>Importance (difference)</TableCell>
          </ShowIf>
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(
          filteredCriteria,
          (criterion: ICriterion): JSX.Element => (
            <TableRow key={criterion.id}>
              <TableCell>{criterion.title}</TableCell>
              {_.map(alternatives, (alternative: IAlternative) => (
                <TableCell key={alternative.id}>
                  {significantDigits(
                    valueProfiles[alternative.id][criterion.id]
                  )}
                </TableCell>
              ))}
              <ShowIf condition={isRelative}>
                <TableCell>
                  {significantDigits(
                    valueProfiles[alternatives[0].id][criterion.id] -
                      valueProfiles[alternatives[1].id][criterion.id]
                  )}
                </TableCell>
                <TableCell>{Math.round(importances[criterion.id])}%</TableCell>
              </ShowIf>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}
