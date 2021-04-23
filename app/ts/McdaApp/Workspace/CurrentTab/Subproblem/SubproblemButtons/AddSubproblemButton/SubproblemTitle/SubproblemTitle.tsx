import TextField from '@material-ui/core/TextField';
import React, {ChangeEvent, KeyboardEvent, useContext} from 'react';
import {AddSubproblemContext} from '../AddSubproblemContext';

export default function SubproblemTitle({
  handleKeyCallback
}: {
  handleKeyCallback: (event: KeyboardEvent<HTMLDivElement>) => void;
}) {
  const {title, setTitle} = useContext(AddSubproblemContext);

  function titleChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setTitle(event.target.value);
  }

  return (
    <TextField
      label="Problem title"
      id="subproblem-title-input"
      value={title}
      onChange={titleChanged}
      onKeyDown={handleKeyCallback}
      variant="outlined"
      autoFocus
      fullWidth
    />
  );
}
