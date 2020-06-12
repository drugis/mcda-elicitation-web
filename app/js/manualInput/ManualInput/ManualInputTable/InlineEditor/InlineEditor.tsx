import {Grid, IconButton, TextField, Tooltip} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

export default function InlineEditor({
  value,
  tooltipText,
  callback,
  errorOnEmpty,
  multiline
}: {
  value: string;
  tooltipText: string;
  callback: (newValue: string) => void;
  errorOnEmpty?: boolean;
  multiline?: boolean;
}) {
  const [areWeEditing, setAreWeEditing] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<string>(value);

  function toggleEdit() {
    if (!areWeEditing) {
      setNewValue(value);
    }
    setAreWeEditing(!areWeEditing);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.keyCode === 13) {
      callback(newValue);
      toggleEdit();
    } else if (event.keyCode === 27) {
      toggleEdit();
    }
  }

  function handleClick() {
    callback(newValue);
    toggleEdit();
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNewValue(event.target.value);
  }

  return areWeEditing ? (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          value={newValue}
          onChange={handleChange}
          autoFocus
          multiline={multiline}
          onBlur={handleClick}
          onKeyDown={handleKey}
          fullWidth
          error={errorOnEmpty && !newValue}
          helperText={errorOnEmpty && !newValue ? 'Please provide a title' : ''}
        />
      </Grid>
    </Grid>
  ) : (
    <Grid container>
      <Grid item xs={10}>
        {errorOnEmpty && !value ? (
          <span className="alert">No title entered</span>
        ) : (
          value
        )}
      </Grid>
      <Grid item xs={2} style={{textAlign: 'right'}}>
        <Tooltip title={tooltipText}>
          <IconButton size="small" color="primary" onClick={toggleEdit}>
            <Edit />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
