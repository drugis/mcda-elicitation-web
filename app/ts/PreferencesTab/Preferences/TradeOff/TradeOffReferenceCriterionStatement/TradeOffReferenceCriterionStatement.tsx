import React, {useContext} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import TradeOffSlider from './TradeOffSlider/TradeOffSlider';

export default function TradeOffReferenceCriterionStatement(): JSX.Element {
  const {
    lowerBound,
    upperBound,
    referenceValueFrom,
    referenceValueTo,
    setReferenceValueFrom,
    setReferenceValueTo,
    referenceCriterion
  } = useContext(TradeOffContext);

  const epsilon = 0.01 * (upperBound - lowerBound);
  const fromSliderStepSize = (referenceValueTo - epsilon - lowerBound) * 0.1;
  const toSliderStepSize = (upperBound - (referenceValueFrom + epsilon)) * 0.1;

  function handleSlider1Changed(
    event: React.ChangeEvent<any>,
    newValue: number
  ) {
    setReferenceValueFrom(newValue);
  }

  function handleSlider2Changed(
    event: React.ChangeEvent<any>,
    newValue: number
  ) {
    setReferenceValueTo(newValue);
  }

  return (
    <div>
      Based on the elicited preferences, changing {referenceCriterion.title}{' '}
      from{' '}
      <TradeOffSlider
        value={referenceValueFrom}
        min={lowerBound}
        max={referenceValueTo - epsilon}
        stepSize={fromSliderStepSize}
        handleChange={handleSlider1Changed}
        id="reference-slider-from"
      />
      to{' '}
      <TradeOffSlider
        value={referenceValueTo}
        min={referenceValueFrom + epsilon}
        max={upperBound}
        stepSize={toSliderStepSize}
        handleChange={handleSlider2Changed}
        id="reference-slider-to"
      />
      is equivalent to:
    </div>
  );
}
