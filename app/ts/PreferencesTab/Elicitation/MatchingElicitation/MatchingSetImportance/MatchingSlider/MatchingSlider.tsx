import Slider from '@material-ui/core/Slider';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {
  getBest,
  getPercentifiedNumber,
  getWorst
} from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
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
  const {showPercentages} = useContext(SettingsContext);
  const {
    currentStep,
    setIsNextDisabled,
    mostImportantCriterionId,
    setPreference
  } = useContext(ElicitationContext);
  const {criteria, pvfs} = useContext(PreferencesContext);

  const mostImportantCriterion = criteria[mostImportantCriterionId];
  const range = pvfs[mostImportantCriterionId].range;
  const usePercentage =
    showPercentages &&
    canBePercentage(mostImportantCriterion.unitOfMeasurement.type);

  const [sliderValue, setSliderValue] = useState<number>(
    getBest(pvfs[mostImportantCriterionId], usePercentage)
  );
  const [stepSize, setStepSize] = useState<number>();

  useEffect(() => {
    const sliderValue = getBest(pvfs[mostImportantCriterionId], false);
    setSliderValue(sliderValue);
    setPreference(currentCriterionId, calculateImportance(sliderValue, range));
  }, [currentStep]);

  useEffect(() => {
    setStepSize(determineStepSize(range));
  }, []);

  function handleSliderChanged(
    event: React.ChangeEvent<any>,
    newValue: number
  ) {
    setSliderValue(newValue);
    setIsNextDisabled(
      newValue === getWorst(pvfs[mostImportantCriterion.id], false)
    );
    setPreference(currentCriterionId, calculateImportance(newValue, range));
  }

  function displayValue() {
    return usePercentage
      ? significantDigits(sliderValue * 100)
      : significantDigits(sliderValue);
  }

  return (
    <>
      {displayValue()}
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
