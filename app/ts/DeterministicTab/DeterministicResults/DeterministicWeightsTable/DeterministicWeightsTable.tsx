import {
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';

export default function DeterministicWeightsTable(): JSX.Element {
  const {filteredCriteria} = useContext(SubproblemContext);
  const {weights} = useContext(DeterministicResultsContext);

  return (
    <Grid container item xs={12}>
      <Grid item xs={9}>
        <Typography variant="h5">
          Weights <InlineHelp helpId="representative-weights" />
        </Typography>
      </Grid>
      <Grid container item xs={3} justify="flex-end">
        <ClipboardButton targetId="#deterministic-weights-table" />
      </Grid>
      <Grid item xs={12}>
        {weights ? (
          <Table id="deterministic-weights-table">
            <TableHead>
              <TableRow>
                {_.map(
                  filteredCriteria,
                  (criterion: ICriterion): JSX.Element => (
                    <TableCell key={criterion.id}>{criterion.title}</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {_.map(filteredCriteria, (criterion: ICriterion) => (
                  <TableCell key={criterion.id}>
                    {significantDigits(
                      weights.mean[criterion.dataSources[0].id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Grid>
  );
}
