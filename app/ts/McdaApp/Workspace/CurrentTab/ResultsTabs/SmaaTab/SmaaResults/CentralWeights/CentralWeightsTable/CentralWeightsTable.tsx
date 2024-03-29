import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import significantDigits from 'app/ts/util/significantDigits';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import {useContext} from 'react';

export default function CentralWeightsTable({
  centralWeights
}: {
  centralWeights: Record<string, ICentralWeight>;
}) {
  const {filteredAlternatives, filteredCriteria} = useContext(
    CurrentSubproblemContext
  );

  function CriterionHeaders(): JSX.Element {
    return (
      <>
        {_.map(filteredCriteria, (criterion: ICriterion) => (
          <TableCell key={criterion.id}>{criterion.title}</TableCell>
        ))}
      </>
    );
  }

  function CentralWeightsTableBody(): JSX.Element {
    return (
      <TableBody>
        {_.map(filteredAlternatives, (alternative: IAlternative) => (
          <TableRow key={alternative.id}>
            <TableCell>{alternative.title}</TableCell>
            <TableCell>
              {centralWeights[alternative.id].cf
                ? centralWeights[alternative.id].cf
                : 0}
            </TableCell>
            <CentralWeightValues alternativeId={alternative.id} />
          </TableRow>
        ))}
      </TableBody>
    );
  }

  function CentralWeightValues({
    alternativeId
  }: {
    alternativeId: string;
  }): JSX.Element {
    return (
      <>
        {_.map(
          filteredCriteria,
          (criterion: ICriterion): JSX.Element => (
            <TableCell
              id={`central-weight-${alternativeId}-${criterion.id}`}
              key={alternativeId + criterion.id}
            >
              {centralWeights[alternativeId].w[criterion.id]
                ? significantDigits(
                    centralWeights[alternativeId].w[criterion.id]
                  )
                : 0}
            </TableCell>
          )
        )}
      </>
    );
  }

  return (
    <Table id="central-weights-table">
      <TableHead>
        <TableRow>
          <TableCell>Alternative</TableCell>
          <TableCell>
            <InlineHelp helpId="confidence-factor">Confidence</InlineHelp>
          </TableCell>
          <CriterionHeaders />
        </TableRow>
      </TableHead>
      <CentralWeightsTableBody />
    </Table>
  );
}
