import TextField from '@material-ui/core/TextField';
import _ from 'lodash';
import {
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
  useState
} from 'react';
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

  const debouncedUpdateTherapeuticContext = useCallback(
    _.debounce(
      (newTherapeuticContext: string) =>
        debouncedFunctionRef.current(newTherapeuticContext),
      500
    ),
    []
  );

  const debouncedFunctionRef: MutableRefObject<
    (newTherapeuticContext: string) => void
  > = useRef((newTherapeuticContext: string) =>
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
