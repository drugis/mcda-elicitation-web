import Slider from '@material-ui/core/Slider';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {
  getBest,
  getWorst
} from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import React, {useContext, useEffect, useState} from 'react';
import {ElicitationContext} from '../../../ElicitationContext';
import {
  calculateImportance,
  determineStepSize
} from '../../MatchingElicitationUtil';

export default function MatchingSlider({
  currentCriterionId
}: {
  currentCriterionId: string;
}) {
  const {
    currentStep,
    setIsNextDisabled,
    mostImportantCriterionId,
    setPreference
  } = useContext(ElicitationContext);
  const {criteria, pvfs} = useContext(PreferencesContext);

  const [sliderValue, setSliderValue] = useState<number>(
    getBest(pvfs[mostImportantCriterionId])
  );
  const [stepSize, setStepSize] = useState<number>();

  const mostImportantCriterion = criteria[mostImportantCriterionId];
  const range = pvfs[mostImportantCriterionId].range;

  useEffect(() => {
    const sliderValue = getBest(pvfs[mostImportantCriterionId]);
    setSliderValue(sliderValue);
    setPreference(currentCriterionId, calculateImportance(sliderValue, range));
  }, [currentStep]);

  useEffect(() => {
    setStepSize(determineStepSize(range));
  }, []);

  function handleSliderChanged(event: any, newValue: any) {
    setSliderValue(newValue);
    setIsNextDisabled(newValue === getWorst(pvfs[mostImportantCriterion.id]));
    setPreference(currentCriterionId, calculateImportance(newValue, range));
  }

  return (
    <>
      {significantDigits(sliderValue)}
      <Slider
        value={sliderValue}
        min={range[0]}
        max={range[1]}
        onChange={handleSliderChanged}
        step={stepSize}
      />
    </>
  );
}
