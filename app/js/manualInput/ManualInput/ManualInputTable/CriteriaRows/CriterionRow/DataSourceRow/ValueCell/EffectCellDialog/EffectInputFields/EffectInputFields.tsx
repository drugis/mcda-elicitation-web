import {Grid} from '@material-ui/core';
import React, {useContext} from 'react';
import {EffectCellContext} from '../../EffectCellContext/EffectCellContext';
import RangeInput from './RangeInput/RangeInput';
import TextInput from './TextInput/TextInput';
import ValueCIInput from './ValueCIInput/ValueCIInput';
import ValueInput from './ValueInput/ValueInput';

export default function EffectInputFields() {
  const {inputType} = useContext(EffectCellContext);

  function createInputFields() {
    switch (inputType) {
      case 'value':
        return <ValueInput />;
      case 'valueCI':
        return <ValueCIInput />;
      case 'range':
        return <RangeInput />;
      case 'text':
        return <TextInput />;
    }
  }

  return (
    <Grid item container xs={12}>
      {createInputFields()}
    </Grid>
  );
}
