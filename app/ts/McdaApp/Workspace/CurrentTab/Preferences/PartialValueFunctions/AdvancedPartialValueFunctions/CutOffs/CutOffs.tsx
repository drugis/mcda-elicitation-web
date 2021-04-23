import {Grid, Slider, Typography} from '@material-ui/core';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/util/significantDigits';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function CutOffs(): JSX.Element {
  const {getUsePercentage} = useContext(SettingsContext);
  const {getStepSizeForCriterion, getConfiguredRange} = useContext(
    CurrentSubproblemContext
  );
  const {advancedPvfCriterion, cutOffs, setCutOffs} = useContext(
    AdvancedPartialValueFunctionContext
  );

  const stepSize = getStepSizeForCriterion(advancedPvfCriterion);
  const configuredRange = getConfiguredRange(advancedPvfCriterion);
  const usePercentage = getUsePercentage(advancedPvfCriterion);

  const sliderParameters = {
    min: significantDigits(configuredRange[0] + stepSize),
    max: significantDigits(configuredRange[1] - stepSize),
    values: cutOffs,
    formatFunction: (x: number) => getPercentifiedValue(x, usePercentage)
  };

  function handleSliderChanged(
    event: React.ChangeEvent<any>,
    newValue: [number, number, number]
  ) {
    setCutOffs(_.sortBy(newValue) as [number, number, number]);
  }

  return (
    <>
      <Grid container item xs={12} justify="flex-start">
        <div style={{width: '420px', marginLeft: '50px', marginRight: '30px'}}>
          <Slider
            id="cut-offs-slider"
            min={sliderParameters.min}
            max={sliderParameters.max}
            marks
            track={false}
            value={sliderParameters.values}
            onChange={handleSliderChanged}
            valueLabelDisplay="on"
            valueLabelFormat={sliderParameters.formatFunction}
            step={stepSize}
          />
        </div>
      </Grid>
      <Grid container item xs={12} justify="flex-start">
        <Typography style={{width: '500px', textAlign: 'center'}}>
          Use the sliders to adjust the shape of the function. They indicate for
          which criterion value (the x-axis) the partial value (the y-axis) is
          0.25, 0.5 and 0.75, respectively.
        </Typography>
      </Grid>
    </>
  );
}
