import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/Scenario/IWeights';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import significantDigits from 'app/ts/util/significantDigits';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';

export default function DeterministicWeightsTable(): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const {weights} = useContext(DeterministicResultsContext);

  return (
    <Grid container item xs={12}>
      <Grid item xs={9}>
        <Typography variant="h5">
          <InlineHelp helpId="representative-weights">Weights</InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={3} justifyContent="flex-end">
        <ClipboardButton targetId="#deterministic-weights-table" />
      </Grid>
      <Grid item xs={12}>
        <LoadingSpinner showSpinnerCondition={!weights}>
          <Table id="deterministic-weights-table">
            <TableHead>
              <TableRow>
                <CriterionTitleCells criteria={filteredCriteria} />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <WeightCells
                  filteredCriteria={filteredCriteria}
                  weights={weights}
                />
              </TableRow>
            </TableBody>
          </Table>
        </LoadingSpinner>
      </Grid>
    </Grid>
  );
}

function WeightCells({
  filteredCriteria,
  weights
}: {
  filteredCriteria: ICriterion[];
  weights: IWeights;
}): JSX.Element {
  return (
    <>
      {_.map(filteredCriteria, (criterion: ICriterion) => (
        <TableCell key={criterion.id}>
          {significantDigits(weights.mean[criterion.id])}
        </TableCell>
      ))}
    </>
  );
}

function CriterionTitleCells({
  criteria
}: {
  criteria: ICriterion[];
}): JSX.Element {
  return (
    <>
      {_.map(
        criteria,
        (criterion: ICriterion): JSX.Element => (
          <TableCell key={criterion.id}>{criterion.title}</TableCell>
        )
      )}
    </>
  );
}
