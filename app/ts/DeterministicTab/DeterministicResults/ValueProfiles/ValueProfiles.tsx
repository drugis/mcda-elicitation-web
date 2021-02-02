import {CircularProgress, Grid, Typography} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {useContext} from 'react';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import ValueProfile from './ValueProfile/ValueProfile';

export default function ValueProfiles(): JSX.Element {
  const {totalValues, valueProfiles} = useContext(DeterministicResultsContext);

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Value profiles <InlineHelp helpId="value-profiles" />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        {totalValues && valueProfiles ? (
          <ValueProfile
            profileCase="Base case"
            totalValues={totalValues}
            valueProfiles={valueProfiles}
          />
        ) : (
          <CircularProgress />
        )}
      </Grid>
      <Grid item xs={6}>
        {totalValues && valueProfiles ? (
          <ValueProfile
            profileCase="Recalculated case"
            totalValues={totalValues}
            valueProfiles={valueProfiles}
          />
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Grid>
  );
}
