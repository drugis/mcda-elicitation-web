import {FormControlLabel} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Help from '@material-ui/icons/Help';
import DisplayWarnings from 'app/ts/util/DisplayWarnings';
import {InlineHelp} from 'help-popup';
import React, {useContext, useState} from 'react';
import {SmaaResultsContext} from '../../SmaaResultsContext/SmaaResultsContext';

export default function UncertaintyOptions() {
  const {
    problemHasStochasticMeasurements,
    problemHasStochasticWeights,
    useMeasurementsUncertainty,
    useWeightsUncertainty,
    warnings,
    recalculate,
    setUseMeasurementsUncertainty,
    setUseWeightsUncertainty
  } = useContext(SmaaResultsContext);

  const [isDirty, setIsDirty] = useState<boolean>(false);

  function handleMeasurementsUncertaintyChanged(): void {
    setIsDirty(true);
    setUseMeasurementsUncertainty(!useMeasurementsUncertainty);
  }

  function handleWeightsUncertaintyChanged(): void {
    setIsDirty(true);
    setUseWeightsUncertainty(!useWeightsUncertainty);
  }

  function handleRecalculateClick(): void {
    setIsDirty(false);
    recalculate();
  }

  return (
    <Grid item container>
      <Grid item xs={3}>
        Take into account uncertainty in:
      </Grid>
      <Grid container item xs={9}>
        <Grid container item xs={12} alignItems="center">
          <FormControlLabel
            value="measurements-uncertainty"
            control={
              <Checkbox
                id="measurements-uncertainty-checkbox"
                checked={useMeasurementsUncertainty}
                onChange={handleMeasurementsUncertaintyChanged}
                disabled={!problemHasStochasticMeasurements}
                color="primary"
              />
            }
            label="measurements"
            labelPlacement="end"
          />
          <InlineHelp helpId="smaa-measurements-uncertainty">
            <Help fontSize="small" style={{marginTop: '5px'}} />
          </InlineHelp>
        </Grid>
        <Grid container item xs={12} alignItems="center">
          <FormControlLabel
            value="weights-uncertainty"
            control={
              <Checkbox
                id="weights-uncertainty-checkbox"
                checked={useWeightsUncertainty}
                onChange={handleWeightsUncertaintyChanged}
                disabled={!problemHasStochasticWeights}
                color="primary"
              />
            }
            label="weights"
            labelPlacement="end"
          />
          <InlineHelp helpId="smaa-weights-uncertainty">
            <Help fontSize="small" style={{marginTop: '5px'}} />
          </InlineHelp>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          id="recalculate-button"
          color="primary"
          variant="contained"
          onClick={handleRecalculateClick}
          disabled={!isDirty}
        >
          Recalculate
        </Button>
      </Grid>
      <DisplayWarnings identifier="smaa-results" warnings={warnings} />
    </Grid>
  );
}
