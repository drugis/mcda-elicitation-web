import Slider from '@material-ui/core/Slider';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import React, {useContext, useEffect, useState} from 'react';

export default function ImpreciseSwingSlider({
  criterion
}: {
  criterion: IElicitationCriterion;
}) {
  const [sliderValue, setSliderValue] = useState<[number, number]>([1, 100]);
  const {setBoundPreference, mostImportantCriterionId} = useContext(
    ElicitationContext
  );

  useEffect(() => {
    setBoundPreference(criterion.id, sliderValue);
  }, [mostImportantCriterionId]);

  function handleSliderChanged(event: any, newValue: any) {
    setSliderValue(newValue);
    setBoundPreference(criterion.id, newValue);
  }

  return (
    <>
      {mostImportantCriterionId === criterion.id
        ? '100%'
        : `${significantDigits(sliderValue[0])} - ${significantDigits(
            sliderValue[1]
          )}%`}
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
