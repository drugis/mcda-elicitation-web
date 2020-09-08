import Slider from '@material-ui/core/Slider';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import React, {useContext} from 'react';

export default function PreciseSwingSlider({
  criterion
}: {
  criterion: IElicitationCriterion;
}) {
  const {setPreference, mostImportantCriterionId, preferences} = useContext(
    ElicitationContext
  );

  function handleSliderChanged(event: any, newValue: any) {
    setPreference(criterion.mcdaId, newValue);
  }

  function calculateSliderValue(): number {
    if (preferences[criterion.mcdaId] === undefined) {
      return 100;
    } else if (preferences[criterion.mcdaId].ratio === 0) {
      return 0;
    } else {
      return 100 / preferences[criterion.mcdaId].ratio;
    }
  }

  return (
    <>
      {significantDigits(calculateSliderValue())}
      <Slider
        value={calculateSliderValue()}
        min={1}
        max={100}
        onChange={handleSliderChanged}
        step={1}
        disabled={mostImportantCriterionId === criterion.mcdaId}
      />
    </>
  );
}
