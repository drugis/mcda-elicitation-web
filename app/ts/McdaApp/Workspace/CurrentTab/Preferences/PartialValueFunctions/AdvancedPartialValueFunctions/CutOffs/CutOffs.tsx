import {Slider, ValueLabelProps, withStyles} from '@material-ui/core';
//@ts-ignore
import ValueLabel from '@material-ui/core/Slider/ValueLabel';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import React, {ElementType, useContext} from 'react';
import {getColorForIndex} from '../../PartialValueFunctionUtil';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

const ColoredValueLabel: unknown = withStyles({
  circle: {
    color: getColorForIndex
  }
})(ValueLabel);

export default function CutOffs(): JSX.Element {
  const {getUsePercentage} = useContext(SettingsContext);
  const {getStepSizeForCriterion, getConfiguredRange} = useContext(
    CurrentSubproblemContext
  );
  const {advancedPvfCriterion, cutoffs, setCutoffs} = useContext(
    AdvancedPartialValueFunctionContext
  );

  const stepSize = getStepSizeForCriterion(advancedPvfCriterion);
  const configuredRange = getConfiguredRange(advancedPvfCriterion);
  const usePercentage = getUsePercentage(advancedPvfCriterion.dataSources[0]);

  const sliderParameters = {
    min: significantDigits(configuredRange[0] + stepSize),
    max: significantDigits(configuredRange[1] - stepSize),
    values: cutoffs,
    formatFunction: (x: number) => getPercentifiedValue(x, usePercentage)
  };

  function handleSliderChanged(
    event: React.ChangeEvent<any>,
    newValue: [number, number, number]
  ) {
    setCutoffs(_.sortBy(newValue) as [number, number, number]);
  }

  return (
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
        ValueLabelComponent={ColoredValueLabel as ElementType<ValueLabelProps>}
      />
    </div>
  );
}
