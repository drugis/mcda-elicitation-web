import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';
import {TPvfDirection} from '@shared/types/TPvfDirection';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {ChangeEvent, useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function PvfDirection(): JSX.Element {
  const {getUsePercentage, showPercentages} = useContext(SettingsContext);
  const {direction, setDirection, advancedPvfCriterion} = useContext(
    AdvancedPartialValueFunctionContext
  );
  const {getConfiguredRange} = useContext(CurrentSubproblemContext);

  const configuredRange = getConfiguredRange(advancedPvfCriterion);
  const usePercentage = getUsePercentage(advancedPvfCriterion.dataSources[0]);

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    setDirection(event.target.value as TPvfDirection);
  }

  return (
    <>
      <Typography>Choose partial value function's direction:</Typography>
      <RadioGroup
        name="pvf-direction-radio"
        value={direction}
        onChange={handleRadioChanged}
      >
        <FormControlLabel
          id="increasing-pvf-option"
          control={<Radio />}
          value="increasing"
          label={`Increasing (${getPercentifiedValue(
            configuredRange[1],
            usePercentage
          )} ${getUnitLabel(
            advancedPvfCriterion.dataSources[0].unitOfMeasurement,
            showPercentages
          )} is best)`}
        />
        <FormControlLabel
          id="decreasing-pvf-option"
          control={<Radio />}
          value="decreasing"
          label={`Decreasing (${getPercentifiedValue(
            configuredRange[0],
            usePercentage
          )} ${getUnitLabel(
            advancedPvfCriterion.dataSources[0].unitOfMeasurement,
            showPercentages
          )} is best)`}
        />
      </RadioGroup>
    </>
  );
}
