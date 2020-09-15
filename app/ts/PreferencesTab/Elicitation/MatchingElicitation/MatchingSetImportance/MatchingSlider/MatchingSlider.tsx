import Slider from '@material-ui/core/Slider';
import {
  getBest,
  getWorst
} from 'app/ts/PreferencesTab/Elicitation/ElicitationUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import React, {useContext, useEffect, useState} from 'react';
import {ElicitationContext} from '../../../ElicitationContext';
import {
  calculateImportance,
  determineStepSize
} from '../../MatchingElicitationUtil';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';

export default function MatchingSlider({
  currentCriterionId
}: {
  currentCriterionId: string;
}) {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const {
    currentStep,
    setIsNextDisabled,
    mostImportantCriterionId,
    setPreference
  } = useContext(ElicitationContext);
  const {criteria} = useContext(PreferencesContext);

  const mostImportantCriterion = criteria[mostImportantCriterionId];
  const scales = mostImportantCriterion.scales;
  const stepSize = determineStepSize(criteria, currentCriterionId);

  useEffect(() => {
    const sliderValue = getBest(mostImportantCriterion);
    setSliderValue(sliderValue);
    setPreference(currentCriterionId, calculateImportance(sliderValue, scales));
  }, [currentStep, mostImportantCriterionId]);

  function handleSliderChanged(event: any, newValue: any) {
    setSliderValue(newValue);
    setIsNextDisabled(newValue === getWorst(mostImportantCriterion));
    setPreference(currentCriterionId, calculateImportance(newValue, scales));
  }

  return (
    <>
      {significantDigits(sliderValue)}
      <Slider
        value={sliderValue}
        min={Math.min(...scales)}
        max={Math.max(...scales)}
        onChange={handleSliderChanged}
        step={stepSize}
      />
    </>
  );
}
