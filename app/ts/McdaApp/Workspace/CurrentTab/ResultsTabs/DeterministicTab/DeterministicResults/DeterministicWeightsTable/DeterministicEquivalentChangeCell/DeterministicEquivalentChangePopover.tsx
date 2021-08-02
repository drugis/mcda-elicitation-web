import {Grid, InputAdornment, Popover, TextField} from '@material-ui/core';
import React, {ChangeEvent, useState} from 'react';

export default function DeterministicEquivalentChangePopover({
  anchorEl,
  closeCallback,
  initialValue,
  unitLabel
}: {
  anchorEl: HTMLButtonElement | null;
  closeCallback: (inputError: string, localValue: number) => void;
  initialValue: number;
  unitLabel: string;
}) {
  const [inputError, setInputError] = useState<string>('');
  const [localValue, setLocalValue] = useState<number>(initialValue);

  function inputChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const newValue = Number.parseFloat(event.target.value);
    if (isNaN(newValue)) {
      setInputError('Invalid value');
    } else {
      setInputError('');
    }
    setLocalValue(newValue);
  }

  function handleClose(): void {
    closeCallback(inputError, localValue);
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{vertical: 'center', horizontal: 'center'}}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      anchorEl={anchorEl}
    >
      <Grid
        container
        style={{minWidth: '300px', minHeight: '100px'}}
        alignItems={'center'}
      >
        <Grid item xs={12} style={{textAlign: 'center', marginBottom: '20px'}}>
          <TextField
            id="value-input"
            value={localValue}
            onChange={inputChanged}
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{unitLabel}</InputAdornment>
              )
            }}
            error={Boolean(inputError)}
            helperText={inputError ? inputError : ''}
            autoFocus
          />
        </Grid>
      </Grid>
    </Popover>
  );
}
