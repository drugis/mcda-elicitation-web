import {FormControlLabel, Radio, RadioGroup} from '@material-ui/core';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {TEquivalentChange} from 'app/ts/type/equivalentChange';
import React, {ChangeEvent, useContext} from 'react';
import {EquivalentChangeContext as EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';

export default function EquivalentChangeTypeToggle() {
  const {
    equivalentChange: {type}
  } = useContext(CurrentScenarioContext);
  const {updateEquivalentChangeType} = useContext(EquivalentChangeContext);

  function handleequivalentChangeTypeChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    updateEquivalentChangeType(event.target.value as TEquivalentChange);
  }

  return (
    <RadioGroup
      row
      name="equivalent-change-type-radio"
      value={type}
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
