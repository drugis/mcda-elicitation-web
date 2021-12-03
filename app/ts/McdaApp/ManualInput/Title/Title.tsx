import TextField from '@material-ui/core/TextField';
import {useDebouncedUpdate} from 'app/ts/util/useDebouncedUpdate';
import {useContext, useState} from 'react';
import {ManualInputContext} from '../ManualInputContext';

export default function Title() {
  const {title, updateTitle} = useContext(ManualInputContext);
  const [localTitle, setLocalTitle] = useState(title);

  function handleTitleChange(event: {target: {value: string}}) {
    setLocalTitle(event.target.value);
    debouncedUpdateTitle(event.target.value);
  }

  const debouncedUpdateTitle = useDebouncedUpdate(
    (newTitle: string) => updateTitle(newTitle),
    500
  );

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
