import {TextField} from '@material-ui/core';
import _ from 'lodash';
import React, {useCallback, useContext, useRef, useState} from 'react';
import {ManualInputContext} from '../ManualInputContext';

export default function TherapeuticContext() {
  const {therapeuticContext, updateTherapeuticContext} = useContext(
    ManualInputContext
  );
  const [localTherapeuticContext, setLocalTherapeuticContext] = useState(
    therapeuticContext
  );

  function handleContextChange(event: {target: {value: string}}) {
    setLocalTherapeuticContext(event.target.value);
    debouncedUpdateTherapeuticContext(event.target.value);
  }

  const debouncedUpdateTherapeuticContext = useCallback(
    _.debounce(
      (newTherapeuticContext: string) =>
        debouncedFunctionRef.current(newTherapeuticContext),
      500
    ),
    []
  );

  const debouncedFunctionRef: React.MutableRefObject<(
    newTherapeuticContext: string
  ) => void> = useRef((newTherapeuticContext: string) =>
    updateTherapeuticContext(newTherapeuticContext)
  );

  return (
    <TextField
      id="therapeutic-context"
      label="Therapeutic Context"
      value={localTherapeuticContext}
      variant="outlined"
      onChange={handleContextChange}
      fullWidth
      multiline
      rows={5}
    />
  );
}
