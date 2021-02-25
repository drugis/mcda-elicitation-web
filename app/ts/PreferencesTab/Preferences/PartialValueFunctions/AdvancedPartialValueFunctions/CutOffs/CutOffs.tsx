import {Grid, Slider} from '@material-ui/core';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function CutOffs(): JSX.Element {
  const {getUsePercentage} = useContext(SettingsContext);
  const {getStepSizeForCriterion, getConfiguredRange} = useContext(
    SubproblemContext
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
        <div style={{width: '500px', textAlign: 'center'}}>
          Use the slider to adjust the function shape
        </div>
      </Grid>
    </>
  );
}
