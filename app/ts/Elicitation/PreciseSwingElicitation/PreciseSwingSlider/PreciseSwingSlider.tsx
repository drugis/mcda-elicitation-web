import Slider from '@material-ui/core/Slider';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import React, {useContext, useEffect, useState} from 'react';

export default function PreciseSwingSlider({
  criterion
}: {
  criterion: IElicitationCriterion;
}) {
  const [sliderValue, setSliderValue] = useState<number>(100);
  const {setPreference, mostImportantCriterionId} = useContext(
    ElicitationContext
  );
  useEffect(() => {
    setPreference(criterion.id, sliderValue);
  }, [mostImportantCriterionId]);

  function handleSliderChanged(event: any, newValue: any) {
    setSliderValue(newValue);
    setPreference(criterion.id, newValue);
  }

  return (
    <>
      {significantDigits(sliderValue)}
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
