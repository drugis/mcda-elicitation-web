import Slider from '@material-ui/core/Slider';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import React, {useContext, useEffect, useState} from 'react';
import {MatchingElicitationContext} from '../../../MatchingElicitationContext';

export default function MatchingSlider({
  currentCriterionId
}: {
  currentCriterionId: string;
}) {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const {
    currentStep,
    setImportance,
    mostImportantCriterion,
    setIsNextDisabled
  } = useContext(MatchingElicitationContext);

  useEffect(() => {
    setSliderValue(getBest(mostImportantCriterion));
  }, [currentStep, mostImportantCriterion]);

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

  return (
    <>
      {significantDigits(sliderValue)}
      <Slider
        value={sliderValue}
        min={Math.min(...getScales())}
        max={Math.max(...getScales())}
        onChange={handleSliderChanged}
        step={0.1} //fixme
      />
    </>
  );
}
