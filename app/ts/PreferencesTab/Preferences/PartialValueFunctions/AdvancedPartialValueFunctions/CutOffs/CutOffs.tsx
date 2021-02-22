import {Grid, Slider} from '@material-ui/core';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function CutOffs(): JSX.Element {
  const {showPercentages} = useContext(SettingsContext);
  const {getStepSizeForCriterion, configuredRanges} = useContext(
    SubproblemContext
  );
  const {advancedPvfCriterion, cutOffs, direction, setCutOffs} = useContext(
    AdvancedPartialValueFunctionContext
  );

  const stepSize = getStepSizeForCriterion(advancedPvfCriterion);
  const configuredRange =
    configuredRanges[advancedPvfCriterion.dataSources[0].id];
  const unit = advancedPvfCriterion.dataSources[0].unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unit);

  const sliderParameters =
    direction === 'decreasing'
      ? {
          // displayFrom: getPercentifiedValue(upperBound, usePercentage),
          // displayTo: getPercentifiedValue(lowerBound, usePercentage),
          min: -configuredRange[1],
          max: -configuredRange[0],
          values: _.map(cutOffs, _.partial(_.multiply, -1)),
          formatFunction: (x: number) => {
            return getPercentifiedValue(-x, usePercentage);
          }
        }
      : {
          // displayFrom: getPercentifiedValue(lowerBound, usePercentage),
          // displayTo: getPercentifiedValue(upperBound, usePercentage),
          min: configuredRange[0],
          max: configuredRange[1],
          values: cutOffs,
          formatFunction: (x: number) => {
            return getPercentifiedValue(x, usePercentage);
          }
        };

  function handleSliderChanged(
    event: React.ChangeEvent<any>,
    newValue: [number, number, number]
  ) {
    if (direction === 'decreasing') {
      setCutOffs(
        _.sortBy(_.map(newValue, _.partial(_.multiply, -1))) as [
          number,
          number,
          number
        ]
      );
    } else {
      setCutOffs(_.sortBy(newValue) as [number, number, number]);
    }
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        Choose cut off values
      </Grid>
      <Grid item xs={6}>
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
      </Grid>
    </Grid>
  );
}
