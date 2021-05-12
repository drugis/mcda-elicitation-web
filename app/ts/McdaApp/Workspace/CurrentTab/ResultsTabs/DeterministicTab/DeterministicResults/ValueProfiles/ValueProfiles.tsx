import {Grid, Typography} from '@material-ui/core';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import {InlineHelp} from 'help-popup';
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
    if (!areRecalculatedPlotsLoading && hasNoRecalculatedResults()) {
      return <></>;
    } else {
      return (
        <LoadingSpinner showSpinnerCondition={areRecalculatedPlotsLoading}>
          <ValueProfile
            profileCase="recalculated"
            totalValues={recalculatedTotalValues}
            valueProfiles={recalculatedValueProfiles}
          />
        </LoadingSpinner>
      );
    }
  }

  function hasNoRecalculatedResults(): boolean {
    return !recalculatedTotalValues || !recalculatedValueProfiles;
  }

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="value-profiles">Value profiles</InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <LoadingSpinner
          showSpinnerCondition={!baseTotalValues || !baseValueProfiles}
        >
          <ValueProfile
            profileCase="base"
            totalValues={baseTotalValues}
            valueProfiles={baseValueProfiles}
          />
        </LoadingSpinner>
      </Grid>
      <Grid item xs={6}>
        {renderRecalculatedCase()}
      </Grid>
    </Grid>
  );
}
