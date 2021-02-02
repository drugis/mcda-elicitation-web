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
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {useContext} from 'react';
import _ from 'lodash';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import ICriterion from '@shared/interface/ICriterion';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';

export default function DeterministicWeightsTable(): JSX.Element {
  const {filteredCriteria} = useContext(SubproblemContext);
  const {deterministicWeights} = useContext(DeterministicResultsContext);

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Weights <InlineHelp helpId="representative-weights" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {deterministicWeights ? (
          <Table>
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
                {_.map(filteredCriteria, (criterion: ICriterion) => {
                  return (
                    <TableCell key={criterion.id}>
                      {significantDigits(
                        deterministicWeights.mean[criterion.id]
                      )}
                    </TableCell>
                  );
                })}
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
