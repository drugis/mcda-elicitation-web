import Slider from '@material-ui/core/Slider';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {ElicitationContext} from '../../../../ElicitationContext';

export default function MatchingSlider({
  currentCriterionId
}: {
  currentCriterionId: string;
}) {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const {
    criteria,
    currentStep,
    setImportance,
    mostImportantCriterion,
    setIsNextDisabled
  } = useContext(ElicitationContext);

  useEffect(() => {
    setSliderValue(getBest(mostImportantCriterion));
  }, [currentStep, mostImportantCriterion]);

  const stepSize = determineStepSize();

  function getScales(): [number, number] {
    if (mostImportantCriterion.scales) {
      return mostImportantCriterion.scales;
    } else {
      return [-1, -1];
    }
  }

  function handleSliderChanged(event: any, newValue: any) {
    setSliderValue(newValue);
    setIsNextDisabled(newValue === getWorst(mostImportantCriterion));
    setImportance(currentCriterionId, getImportance(newValue));
  }

  function getImportance(value: number): number {
    const rebased = value - Math.min(...mostImportantCriterion.scales);
    const importance =
      (rebased /
        Math.abs(
          mostImportantCriterion.scales[0] - mostImportantCriterion.scales[1]
        )) *
      100;
    return importance;
  }

  function determineStepSize(): number {
    const criterion: IElicitationCriterion = criteria.get(currentCriterionId);
    const interval = _.max(criterion.scales) - _.min(criterion.scales);
    const magnitude = Math.floor(Math.log10(interval));
    return Math.pow(10, magnitude - 1);
  }

  return (
    <>
      {significantDigits(sliderValue)}
      <Slider
        value={sliderValue}
        min={Math.min(...getScales())}
        max={Math.max(...getScales())}
        onChange={handleSliderChanged}
        step={stepSize}
      />
    </>
  );
}
