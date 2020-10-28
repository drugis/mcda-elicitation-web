import Slider from '@material-ui/core/Slider';
import {ElicitationContext} from 'app/ts/PreferencesTab/Elicitation/ElicitationContext';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import React, {useContext, useEffect, useState} from 'react';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';

export default function ImpreciseSwingSlider({
  criterion
}: {
  criterion: IPreferencesCriterion;
}) {
  const [sliderValue, setSliderValue] = useState<[number, number]>([1, 100]);
  const {setBoundPreference, mostImportantCriterionId} = useContext(
    ElicitationContext
  );

  useEffect(() => {
    setBoundPreference(criterion.id, sliderValue);
  }, [mostImportantCriterionId]);

  function handleSliderChanged(
    event: React.ChangeEvent<any>,
    newValue: [number, number]
  ) {
    setSliderValue(newValue);
    setBoundPreference(criterion.id, newValue);
  }

  function renderValue(): string {
    return mostImportantCriterionId === criterion.id
      ? '100%'
      : `${significantDigits(sliderValue[0])} - ${significantDigits(
          sliderValue[1]
        )}%`;
  }

  return (
    <>
      {renderValue()}
      <Slider
        value={sliderValue}
        min={1}
        max={100}
        onChange={handleSliderChanged}
        step={1}
        disabled={mostImportantCriterionId === criterion.id}
      />
    </>
  );
}
