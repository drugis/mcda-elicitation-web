import {Grid, Popover, Slider, TextField} from '@material-ui/core';
import {CSSProperties} from '@material-ui/core/styles/withStyles';
import React, {ChangeEvent, useState} from 'react';

export default function SensitivityMeasurementsTablePopover({
  anchorEl,
  closePopover,
  min,
  max,
  localValue,
  setLocalValue,
  stepSize
}: {
  anchorEl: HTMLButtonElement | null;
  closePopover: (inputError: string) => void;
  min: number;
  max: number;
  localValue: number;
  setLocalValue: (value: number) => void;
  stepSize: number;
}): JSX.Element {
  const [inputError, setInputError] = useState<string>('');

  const marginTop: CSSProperties = {marginTop: '50px', textAlign: 'center'};

  function inputChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    valueChanged(Number.parseFloat(event.target.value));
  }

  function sliderChanged(event: ChangeEvent<any>, newValue: number): void {
    valueChanged(newValue);
  }

  function valueChanged(newValue: number) {
    if (isNaN(newValue)) {
      setInputError('Invalid value');
    } else if (newValue < min || newValue > max) {
      setInputError(`Value must be between ${min} and ${max}`);
    } else {
      setInputError('');
    }
    setLocalValue(newValue);
  }

  function handleClose(): void {
    closePopover(inputError);
  }

  return (
    <Popover
      open={!!anchorEl}
      onClose={handleClose}
      anchorOrigin={{vertical: 'center', horizontal: 'center'}}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      anchorEl={anchorEl}
    >
      <Grid container style={{minWidth: '300px', minHeight: '100px'}}>
        <Grid item xs={2} style={marginTop}>
          {min}
        </Grid>
        <Grid item xs={8} style={marginTop}>
          <Slider
            id="sensitivity-value-slider"
            marks
            valueLabelDisplay="on"
            value={localValue}
            min={min}
            max={max}
            onChange={sliderChanged}
            step={stepSize}
            track={false}
          />
        </Grid>
        <Grid item xs={2} style={marginTop}>
          {max}
        </Grid>
        <Grid item xs={12} style={{textAlign: 'center', marginBottom: '20px'}}>
          <TextField
            id="sensitivity-value-input"
            value={localValue}
            onChange={inputChanged}
            type="number"
            inputProps={{
              min: min,
              max: max,
              step: stepSize
            }}
            error={!!inputError}
            helperText={inputError ? inputError : ''}
            autoFocus
          />
        </Grid>
      </Grid>
    </Popover>
  );
}
