import React, {useContext} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import TradeOffSlider from './TradeOffSlider/TradeOffSlider';

export default function TradeOffReferenceCriterionStatement(): JSX.Element {
  const {
    lowerBound,
    upperBound,
    value1,
    value2,
    setValue1,
    setValue2,
    referenceCriterion
  } = useContext(TradeOffContext);

  const epsilon = 0.01 * (upperBound - lowerBound);
  const stepSize1 = (value2 - epsilon - lowerBound) * 0.1;
  const stepSize2 = (upperBound - (value1 + epsilon)) * 0.1;

  function handleSlider1Changed(
    event: React.ChangeEvent<any>,
    newValue: number
  ) {
    setValue1(newValue);
  }

  function handleSlider2Changed(
    event: React.ChangeEvent<any>,
    newValue: number
  ) {
    setValue2(newValue);
  }

  return (
    <>
      <div>
        Changing {referenceCriterion.title} from{' '}
        <TradeOffSlider
          value={value1}
          min={lowerBound}
          max={value2 - epsilon}
          stepSize={stepSize1}
          handleChange={handleSlider1Changed}
        />
        to{' '}
        <TradeOffSlider
          value={value2}
          min={value1 + epsilon}
          max={upperBound}
          stepSize={stepSize2}
          handleChange={handleSlider2Changed}
        />
        is equivalent to:
      </div>
    </>
  );
}
