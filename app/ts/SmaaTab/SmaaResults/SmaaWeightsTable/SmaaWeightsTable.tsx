import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {useContext} from 'react';
import _ from 'lodash';
import ICriterion from '@shared/interface/ICriterion';
import {SmaaResultsContext} from '../../SmaaResultsContext/SmaaResultsContext';
import UncertainValue from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/UncertainValue/UncertainValue';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';

export default function SmaaWeightsTable(): JSX.Element {
  const {filteredCriteria} = useContext(SubproblemContext);
  const {smaaWeights} = useContext(SmaaResultsContext);

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Weights <InlineHelp helpId="representative-weights" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Table>
          <TableHead>
            <TableRow>
              {_.map(filteredCriteria, (criterion: ICriterion) => (
                <TableCell key={criterion.id}>{criterion.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {_.map(
                filteredCriteria,
                (criterion: ICriterion): JSX.Element => {
                  const weight = significantDigits(
                    smaaWeights.mean[criterion.id]
                  );
                  const lowerBound = significantDigits(
                    smaaWeights['2.5%'][criterion.id]
                  );
                  const upperBound = significantDigits(
                    smaaWeights['97.5%'][criterion.id]
                  );
                  return (
                    <TableCell key={criterion.id}>
                      <div className="text-centered">
                        <UncertainValue
                          value={weight}
                          lowerBound={lowerBound}
                          upperBound={upperBound}
                        />
                      </div>
                    </TableCell>
                  );
                }
              )}
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
}
