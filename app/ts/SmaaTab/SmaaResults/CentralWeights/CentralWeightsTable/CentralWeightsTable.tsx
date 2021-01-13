import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {SmaaResultsContext} from 'app/ts/SmaaTab/SmaaResultsContext/SmaaResultsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';

export default function CentralWeightsTable() {
  const {filteredAlternatives, filteredCriteria} = useContext(
    SubproblemContext
  );
  const {centralWeights} = useContext(SmaaResultsContext);

  return (
    <Table id="central-weights-table">
      <TableHead>
        <TableRow>
          <TableCell>Alternative</TableCell>
          <TableCell>
            Confidence <InlineHelp helpId="confidence-factor" />
          </TableCell>
          {_.map(filteredCriteria, (criterion: ICriterion) => (
            <TableCell key={criterion.id}>{criterion.title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(filteredAlternatives, (alternative: IAlternative) => (
          <TableRow key={alternative.id}>
            <TableCell>{alternative.title}</TableCell>
            <TableCell>{centralWeights[alternative.id].cf}</TableCell>
            {_.map(
              filteredCriteria,
              (criterion: ICriterion): JSX.Element => (
                <TableCell
                  id={`central-weight-${alternative.id}-${criterion.id}`}
                  key={alternative.id + criterion.id}
                >
                  {significantDigits(
                    centralWeights[alternative.id].w[criterion.id]
                  )}
                </TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
