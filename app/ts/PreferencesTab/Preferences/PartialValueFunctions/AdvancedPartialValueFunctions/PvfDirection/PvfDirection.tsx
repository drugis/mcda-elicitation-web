import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TPvfDirection} from '@shared/types/TPvfDirection';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {ChangeEvent, useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function PvfDirection(): JSX.Element {
  const {getUsePercentage} = useContext(SettingsContext);
  const {direction, setDirection, advancedPvfCriterion} = useContext(
    AdvancedPartialValueFunctionContext
  );
  const {getConfiguredRange} = useContext(SubproblemContext);

  const configuredRange = getConfiguredRange(advancedPvfCriterion);
  const usePercentage = getUsePercentage(advancedPvfCriterion);

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    setDirection(event.target.value as TPvfDirection);
  }

  return (
    <>
      <Grid item xs={12}>
        Choose partial value function's direction:
        <RadioGroup
          name="pvf-direction-radio"
          value={direction}
          onChange={handleRadioChanged}
        >
          <label id="increasing-pvf-option">
            <Radio value="increasing" /> Increasing (
            {getPercentifiedValue(configuredRange[1], usePercentage)} is best)
          </label>
          <label id="decreasing-pvf-option">
            <Radio value="decreasing" /> Decreasing (
            {getPercentifiedValue(configuredRange[0], usePercentage)} is best)
          </label>
        </RadioGroup>
      </Grid>
    </>
  );
}
