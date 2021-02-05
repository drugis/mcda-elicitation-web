import {CircularProgress, Grid, Typography} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {useContext} from 'react';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import ValueProfile from './ValueProfile/ValueProfile';

export default function ValueProfiles(): JSX.Element {
  const {
    baseTotalValues,
    baseValueProfiles,
    recalculatedTotalValues,
    recalculatedValueProfiles,
    areRecalculatedPlotsLoading
  } = useContext(DeterministicResultsContext);

  function renderRecalculatedCase(): JSX.Element {
    if (
      !areRecalculatedPlotsLoading &&
      recalculatedTotalValues &&
      recalculatedValueProfiles
    ) {
      return (
        <ValueProfile
          profileCase="recalculated"
          totalValues={recalculatedTotalValues}
          valueProfiles={recalculatedValueProfiles}
        />
      );
    } else if (areRecalculatedPlotsLoading) {
      return <CircularProgress />;
    } else {
      return <></>;
    }
  }

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Value profiles <InlineHelp helpId="value-profiles" />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        {baseTotalValues && baseValueProfiles ? (
          <ValueProfile
            profileCase="base"
            totalValues={baseTotalValues}
            valueProfiles={baseValueProfiles}
          />
        ) : (
          <CircularProgress />
        )}
      </Grid>
      <Grid item xs={6}>
        {renderRecalculatedCase()}
      </Grid>
    </Grid>
  );
}
