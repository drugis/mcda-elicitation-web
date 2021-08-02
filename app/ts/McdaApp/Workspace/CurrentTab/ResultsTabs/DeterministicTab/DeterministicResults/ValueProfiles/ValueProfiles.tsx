import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';
import {TValueProfile} from '@shared/types/TValueProfile';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import React, {ChangeEvent, useContext} from 'react';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import ValueProfile from './ValueProfile/ValueProfile';

export default function ValueProfiles(): JSX.Element {
  const {
    baseTotalValues,
    baseValueProfiles,
    recalculatedTotalValues,
    recalculatedValueProfiles,
    areRecalculatedPlotsLoading,
    valueProfileType,
    setValueProfileType
  } = useContext(DeterministicResultsContext);

  function RecalculatedProfile(): JSX.Element {
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

  function handleValueProfileTypeChange(event: ChangeEvent<HTMLInputElement>) {
    setValueProfileType(event.target.value as TValueProfile);
  }

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="value-profiles">Value profiles</InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          row
          name="value-profile-type-radio"
          value={valueProfileType}
          onChange={handleValueProfileTypeChange}
        >
          <FormControlLabel
            id="value-profile-type-absolute"
            value="absolute"
            control={<Radio />}
            label="Absolute"
          />
          <FormControlLabel
            id="value-profile-type-relative"
            value="relative"
            control={<Radio />}
            label="Relative"
          />
        </RadioGroup>
      </Grid>
      <Grid item md={6} xs={12}>
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
      <Grid item md={6} xs={12}>
        <RecalculatedProfile />
      </Grid>
    </Grid>
  );
}
