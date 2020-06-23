import {TextField} from '@material-ui/core';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';

export default function TherapeuticContext() {
  const {therapeuticContext, updateTherapeuticContext} = useContext(
    ManualInputContext
  );

  function handleContextChange(event: {target: {value: string}}) {
    updateTherapeuticContext(event.target.value);
  }

  return (
    <TextField
      id="therapeutic-context"
      label="Therapeutic Context"
      value={therapeuticContext}
      variant="outlined"
      onChange={handleContextChange}
      fullWidth
      multiline
      rows={5}
    />
  );
}
