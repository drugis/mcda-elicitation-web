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

export default function Title() {
  const {title, updateTitle} = useContext(ManualInputContext);
  const [localTitle, setLocalTitle] = useState(title);

  function handleTitleChange(event: {target: {value: string}}) {
    setLocalTitle(event.target.value);
    debouncedUpdateTitle(event.target.value);
  }

  const debouncedUpdateTitle = useCallback(
    _.debounce(
      (newTitle: string) => debouncedFunctionRef.current(newTitle),
      500
    ),
    []
  );

  const debouncedFunctionRef: MutableRefObject<(newTitle: string) => void> =
    useRef((newTitle: string) => updateTitle(newTitle));

  return (
    <TextField
      id="workspace-title"
      label="Title"
      variant="outlined"
      onChange={handleTitleChange}
      value={localTitle}
      fullWidth
    />
  );
}
