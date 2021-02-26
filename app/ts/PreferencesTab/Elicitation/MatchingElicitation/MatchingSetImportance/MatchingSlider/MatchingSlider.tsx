import Slider from '@material-ui/core/Slider';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {
  getBest,
  getWorst
} from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
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
  const {getUsePercentage} = useContext(SettingsContext);
  const {
    currentStep,
    setIsNextDisabled,
    mostImportantCriterionId,
    setPreference
  } = useContext(ElicitationContext);
  const {pvfs} = useContext(PreferencesContext);
  const {getCriterion} = useContext(SubproblemContext);

  const mostImportantCriterion = getCriterion(mostImportantCriterionId);
  const pvf = pvfs[mostImportantCriterionId];

  const usePercentage = getUsePercentage(mostImportantCriterion);

  const [sliderValue, setSliderValue] = useState<number>(
    getBest(pvfs[mostImportantCriterionId], usePercentage)
  );
  const [stepSize, setStepSize] = useState<number>();

  useEffect(() => {
    const sliderValue = getBest(pvf, false);
    setSliderValue(sliderValue);
    setPreference(currentCriterionId, calculateImportance(sliderValue, pvf));
  }, [currentStep]);

  useEffect(() => {
    setStepSize(determineStepSize(pvf.range));
  }, []);

  function handleSliderChanged(
    event: React.ChangeEvent<any>,
    newValue: number
  ) {
    setSliderValue(newValue);
    setIsNextDisabled(
      significantDigits(newValue) ===
        getWorst(pvfs[mostImportantCriterion.id], false)
    );
    setPreference(currentCriterionId, calculateImportance(newValue, pvf));
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
        id="matching-slider"
        value={sliderValue}
        min={pvf.range[0]}
        max={pvf.range[1]}
        onChange={handleSliderChanged}
        step={stepSize}
      />
    </>
  );
}
