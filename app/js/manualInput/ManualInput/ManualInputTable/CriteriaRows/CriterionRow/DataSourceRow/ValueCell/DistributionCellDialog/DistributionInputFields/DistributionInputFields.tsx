import {Grid} from '@material-ui/core';
import React, {KeyboardEvent, useContext} from 'react';
import {DistributionCellContext} from '../../DistributionCellContext/DistributionCellContext';
import ValueInput from '../../EffectCellDialog/EffectInputFields/ValueInput/ValueInput';
import RangeInput from '../../EffectCellDialog/EffectInputFields/RangeInput/RangeInput';
import TextInput from '../../EffectCellDialog/EffectInputFields/TextInput/TextInput';
import NormalInput from './NormalInput/NormalInput';
import BetaInput from './BetaInput/BetaInput';
import GammaInput from './GammaInput/GammaInput';

export default function DistributionInputFields({
  editButtonCallback,
  isInputInvalid
}: {
  editButtonCallback: () => void;
  isInputInvalid: () => boolean;
}) {
  const {inputType} = useContext(DistributionCellContext);

  function createInputFields(): JSX.Element {
    switch (inputType) {
      case 'value':
        return <ValueInput context={DistributionCellContext} />;
      case 'range':
        return <RangeInput context={DistributionCellContext} />;
      case 'text':
        return <TextInput context={DistributionCellContext} />;
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
