import {Grid} from '@material-ui/core';
import React, {KeyboardEvent, useContext} from 'react';
import RangeInput from '../../EffectCellDialog/EffectInputFields/RangeInput/RangeInput';
import TextInput from '../../EffectCellDialog/EffectInputFields/TextInput/TextInput';
import ValueInput from '../../EffectCellDialog/EffectInputFields/ValueInput/ValueInput';
import {InputCellContext} from '../../InputCellContext/InputCellContext';
import BetaInput from './BetaInput/BetaInput';
import GammaInput from './GammaInput/GammaInput';
import NormalInput from './NormalInput/NormalInput';

export default function DistributionInputFields({
  editButtonCallback,
  isInputInvalid
}: {
  editButtonCallback: () => void;
  isInputInvalid: () => boolean;
}) {
  const {inputType} = useContext(InputCellContext);

  function createInputFields(): JSX.Element {
    switch (inputType) {
      case 'value':
        return <ValueInput />;
      case 'range':
        return <RangeInput />;
      case 'text':
        return <TextInput />;
      case 'normal':
        return <NormalInput />;
      case 'beta':
        return <BetaInput />;
      case 'gamma':
        return <GammaInput />;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.keyCode === 13 && !isInputInvalid()) {
      editButtonCallback();
    }
  }

  return (
    <Grid item container xs={12} onKeyDown={handleKeyDown}>
      {createInputFields()}
    </Grid>
  );
}
