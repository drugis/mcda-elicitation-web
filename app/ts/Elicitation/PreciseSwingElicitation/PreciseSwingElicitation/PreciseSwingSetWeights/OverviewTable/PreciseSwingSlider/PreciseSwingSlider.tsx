import Slider from '@material-ui/core/Slider';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import React, {useContext} from 'react';

export default function PreciseSwingSlider({
  criterion
}: {
  criterion: IElicitationCriterion;
}) {
  const {setImportance, mostImportantCriterion} = useContext(
    ElicitationContext
  );

  function handleSliderChanged(event: any, newValue: any) {
    setImportance(criterion.mcdaId, newValue);
  }

  return (
    <>
      {criterion.importance}
      <Slider
        value={criterion.importance ? criterion.importance : 100}
        min={1}
        max={100}
        onChange={handleSliderChanged}
        step={1}
        disabled={mostImportantCriterion.mcdaId === criterion.mcdaId}
      />
    </>
  );
}
