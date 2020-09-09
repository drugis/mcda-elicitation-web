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
  const [sliderValue, setSliderValue] = useState<number>(0);
  const {setPreference, mostImportantCriterionId, preferences} = useContext(
    ElicitationContext
  );

  useEffect(() => {
    const sliderValue = calculateSliderValue();
    setSliderValue(sliderValue);
    setPreference(criterion.id, sliderValue);
  }, [mostImportantCriterionId]);

  function handleSliderChanged(event: any, newValue: any) {
    setSliderValue(newValue);
    setPreference(criterion.id, newValue);
  }

  function calculateSliderValue(): number {
    if (preferences[criterion.id] === undefined) {
      return 100;
    } else if (preferences[criterion.id].ratio === 0) {
      return 0;
    } else {
      return 100 / preferences[criterion.id].ratio;
    }
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
