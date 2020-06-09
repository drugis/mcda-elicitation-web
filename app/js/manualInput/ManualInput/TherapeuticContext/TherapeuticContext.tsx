import {TextField} from '@material-ui/core';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';

export default function TherapeuticContext() {
  const {therapeuticContext, setTherapeuticContext} = useContext(
    ManualInputContext
  );

  function handleContextChange(event: {target: {value: string}}) {
    setTherapeuticContext(event.target.value);
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
