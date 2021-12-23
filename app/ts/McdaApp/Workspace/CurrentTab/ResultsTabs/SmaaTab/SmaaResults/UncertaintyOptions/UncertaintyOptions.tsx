import {FormControlLabel, Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import DisplayWarnings from 'app/ts/util/SharedComponents/DisplayWarnings';
import {InlineQuestionMark} from 'help-popup';
import {useContext, useEffect, useState} from 'react';
import {SmaaResultsContext} from '../../SmaaResultsContext/SmaaResultsContext';
import {getSmaaWarnings} from '../SmaaResultsUtil';

export default function UncertaintyOptions() {
  const {
    problemHasStochasticMeasurements,
    problemHasStochasticWeights,
    useMeasurementsUncertainty,
    useWeightsUncertainty,
    setUseMeasurementsUncertainty,
    setUseWeightsUncertainty
  } = useContext(SmaaResultsContext);
  const {currentScenario, updateScenario} = useContext(CurrentScenarioContext);

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [localUseMeasurementsUncertainty, setLocalUseMeasurementsUncertainty] =
    useState(useMeasurementsUncertainty);

  const [localUseWeightsUncertainty, setLocalUseWeightsUncertainty] = useState(
    useWeightsUncertainty
  );

  const [warnings, setWarnings] = useState<string[]>(
    getSmaaWarnings(
      localUseMeasurementsUncertainty,
      localUseWeightsUncertainty,
      problemHasStochasticMeasurements,
      problemHasStochasticWeights
    )
  );

  useEffect(() => {
    setWarnings(
      getSmaaWarnings(
        localUseMeasurementsUncertainty,
        localUseWeightsUncertainty,
        problemHasStochasticMeasurements,
        problemHasStochasticWeights
      )
    );
  }, [
    problemHasStochasticMeasurements,
    problemHasStochasticWeights,
    localUseMeasurementsUncertainty,
    localUseWeightsUncertainty
  ]);

  function handleMeasurementsUncertaintyChanged(): void {
    setIsDirty(true);
    setLocalUseMeasurementsUncertainty(!localUseMeasurementsUncertainty);
  }

  function handleWeightsUncertaintyChanged(): void {
    setIsDirty(true);
    setLocalUseWeightsUncertainty(!localUseWeightsUncertainty);
  }

  function handleRecalculateClick(): void {
    setIsDirty(false);
    setUseMeasurementsUncertainty(localUseMeasurementsUncertainty);
    setUseWeightsUncertainty(localUseWeightsUncertainty);
    updateScenario({
      ...currentScenario,
      state: {
        ...currentScenario.state,
        uncertaintyOptions: {
          measurements: localUseMeasurementsUncertainty,
          weights: localUseWeightsUncertainty
        }
      }
    });
  }

  return (
    <Grid item container>
      <Grid item xs={3}>
        <Typography>Take into account uncertainty in:</Typography>
      </Grid>
      <Grid container item xs={9}>
        <Grid container item xs={12} alignItems="center">
          <FormControlLabel
            value="measurements-uncertainty"
            control={
              <Checkbox
                id="measurements-uncertainty-checkbox"
                checked={localUseMeasurementsUncertainty}
                onChange={handleMeasurementsUncertaintyChanged}
                disabled={!problemHasStochasticMeasurements}
                color="primary"
              />
            }
            label="measurements"
            labelPlacement="end"
          />
          <InlineQuestionMark helpId="smaa-measurements-uncertainty" />
        </Grid>
        <Grid container item xs={12} alignItems="center">
          <FormControlLabel
            value="weights-uncertainty"
            control={
              <Checkbox
                id="weights-uncertainty-checkbox"
                checked={localUseWeightsUncertainty}
                onChange={handleWeightsUncertaintyChanged}
                disabled={!problemHasStochasticWeights}
                color="primary"
              />
            }
            label="weights"
            labelPlacement="end"
          />
          <InlineQuestionMark helpId="smaa-weights-uncertainty" />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          id="recalculate-button"
          color="primary"
          variant="contained"
          onClick={handleRecalculateClick}
          disabled={!isDirty}
          size="small"
        >
          Recalculate
        </Button>
      </Grid>
      <Grid item xs={12}>
        <DisplayWarnings identifier="smaa-results" warnings={warnings} />
      </Grid>
    </Grid>
  );
}
