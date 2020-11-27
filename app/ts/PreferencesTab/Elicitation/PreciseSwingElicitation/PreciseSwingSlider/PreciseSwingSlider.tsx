import Slider from '@material-ui/core/Slider';
import ICriterion from '@shared/interface/ICriterion';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {ElicitationContext} from 'app/ts/PreferencesTab/Elicitation/ElicitationContext';
import React, {useContext, useEffect, useState} from 'react';

export default function PreciseSwingSlider({
  criterion
}: {
  criterion: ICriterion;
}) {
  const [sliderValue, setSliderValue] = useState<number>(100);
  const {setPreference, mostImportantCriterionId} = useContext(
    ElicitationContext
  );

  useEffect(() => {
    setPreference(criterion.id, sliderValue);
  }, [mostImportantCriterionId]);

  function handleSliderChanged(
    event: React.ChangeEvent<any>,
    newValue: number
  ) {
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
