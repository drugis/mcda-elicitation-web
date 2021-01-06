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
  const stepSize1 = (referenceValueTo - epsilon - lowerBound) * 0.1;
  const stepSize2 = (upperBound - (referenceValueFrom + epsilon)) * 0.1;

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
      Changing {referenceCriterion.title} from{' '}
      <TradeOffSlider
        value={referenceValueFrom}
        min={lowerBound}
        max={referenceValueTo - epsilon}
        stepSize={stepSize1}
        handleChange={handleSlider1Changed}
      />
      to{' '}
      <TradeOffSlider
        value={referenceValueTo}
        min={referenceValueFrom + epsilon}
        max={upperBound}
        stepSize={stepSize2}
        handleChange={handleSlider2Changed}
      />
      is equivalent to:
    </div>
  );
}
