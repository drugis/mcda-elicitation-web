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
import IWeights from '@shared/interface/Scenario/IWeights';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import UncertainValue from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/UncertainValue/UncertainValue';
import significantDigits from 'app/ts/util/significantDigits';
import {useStyles} from 'app/ts/McdaApp/McdaApp';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';

export default function SmaaWeightsTable({
  smaaWeights
}: {
  smaaWeights: IWeights;
}): JSX.Element {
  const classes = useStyles();

  const {filteredCriteria} = useContext(CurrentSubproblemContext);

  function CriterionHeaders(): JSX.Element {
    return (
      <TableRow>
        {_.map(filteredCriteria, (criterion: ICriterion) => (
          <TableCell key={criterion.id}>{criterion.title}</TableCell>
        ))}
      </TableRow>
    );
  }

  function SmaaWeightsValueRow(): JSX.Element {
    return (
      <TableRow>
        {_.map(
          filteredCriteria,
          (criterion: ICriterion): JSX.Element => {
            const weight = significantDigits(smaaWeights.mean[criterion.id]);
            const lowerBound = significantDigits(
              smaaWeights['2.5%'][criterion.id]
            );
            const upperBound = significantDigits(
              smaaWeights['97.5%'][criterion.id]
            );
            return (
              <TableCell key={criterion.id}>
                <div className={classes.textCenter}>
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
    );
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={9}>
        <Typography variant="h5">
          <InlineHelp helpId="representative-weights">Weights</InlineHelp>
        </Typography>
      </Grid>
      {smaaWeights ? (
        <>
          <Grid container item xs={3} justify="flex-end">
            <ClipboardButton targetId="#weigths-table" />
          </Grid>
          <Grid item xs={12}>
            <Table id="weigths-table">
              <TableHead>
                <CriterionHeaders />
              </TableHead>
              <TableBody>
                <SmaaWeightsValueRow />
              </TableBody>
            </Table>
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
}
