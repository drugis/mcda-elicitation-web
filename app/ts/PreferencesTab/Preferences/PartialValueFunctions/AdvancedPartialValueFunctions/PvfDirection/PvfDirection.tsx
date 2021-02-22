import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TPvfDirection} from '@shared/types/PvfTypes';
import React, {ChangeEvent, useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function PvfDirection(): JSX.Element {
  const {direction, setDirection} = useContext(
    AdvancedPartialValueFunctionContext
  );

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    setDirection(event.target.value as TPvfDirection);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        Choose partial value function's direction
      </Grid>
      <Grid item xs={6}>
        <RadioGroup
          name="pvf-direction-radio"
          value={direction}
          onChange={handleRadioChanged}
        >
          <label id="increasing-pvf-option">
            <Radio value="increasing" /> Increasing
          </label>
          <label id="decreasing-pvf-option">
            <Radio value="decreasing" /> Decreasing
          </label>
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
