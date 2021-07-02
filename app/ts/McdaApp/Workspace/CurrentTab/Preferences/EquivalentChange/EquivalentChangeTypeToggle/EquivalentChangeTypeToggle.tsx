import {FormControlLabel, Radio, RadioGroup} from '@material-ui/core';
import {EquivalentChangeType} from 'app/ts/type/EquivalentChangeType';
import React, {ChangeEvent, useContext} from 'react';
import {EquivalentChangeContext as EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';

export default function EquivalentChangeTypeToggle() {
  const {equivalentChangeType, setEquivalentChangeType} = useContext(
    EquivalentChangeContext
  );

  function handleequivalentChangeTypeChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setEquivalentChangeType(event.target.value as EquivalentChangeType);
  }

  return (
    <RadioGroup
      row
      name="equivalent-change-type-radio"
      value={equivalentChangeType}
      onChange={handleequivalentChangeTypeChanged}
    >
      <FormControlLabel
        value="amount"
        control={<Radio id="equivalent-change-value-type" />}
        label="Specify change as amount"
      />
      <FormControlLabel
        value="range"
        control={<Radio id="equivalent-change-range-type" />}
        label="Specify change as from X to Y"
      />
    </RadioGroup>
  );
}
