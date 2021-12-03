import TextField from '@material-ui/core/TextField';
import {useDebouncedUpdate} from 'app/ts/util/useDebouncedUpdate';
import {useContext, useState} from 'react';
import {ManualInputContext} from '../ManualInputContext';

export default function ManualInputTherapeuticContext() {
  const {therapeuticContext, updateTherapeuticContext} =
    useContext(ManualInputContext);
  const [localTherapeuticContext, setLocalTherapeuticContext] =
    useState(therapeuticContext);

  function handleContextChange(event: {target: {value: string}}) {
    setLocalTherapeuticContext(event.target.value);
    debouncedUpdateTherapeuticContext(event.target.value);
  }

  const debouncedUpdateTherapeuticContext = useDebouncedUpdate(
    (newTherapeuticContext: string) =>
      updateTherapeuticContext(newTherapeuticContext),
    500
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
