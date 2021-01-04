import {Slider} from '@material-ui/core';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext, useState} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import TradeOffSlider from './TradeOffSlider/TradeOffSlider';

export default function TradeOffReferenceCriterionStatement(): JSX.Element {
  const {referenceCriterion} = useContext(TradeOffContext);
  const {currentSubproblem} = useContext(WorkspaceContext);
  const configuredRange =
    currentSubproblem.definition.ranges[referenceCriterion.dataSources[0].id];

  const [lowerBound, upperBound] = configuredRange;
  const initialValue1 = (upperBound - lowerBound) * 0.45 + lowerBound;
  const initialValue2 = (upperBound - lowerBound) * 0.55 + lowerBound;
  const [value1, setValue1] = useState<number>(initialValue1);
  const [value2, setValue2] = useState<number>(initialValue2);
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
