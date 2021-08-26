import {Grid, Popover, Slider, TextField, Typography} from '@material-ui/core';
import {ChangeEvent, CSSProperties, useState} from 'react';

export default function ClickableSliderPopover({
  anchorEl,
  closeCallback,
  min,
  max,
  stepSize,
  initialValue
}: {
  anchorEl: HTMLButtonElement | null;
  closeCallback: (inputError: string, localValue: number) => void;
  min: number;
  max: number;
  stepSize: number;
  initialValue: number;
}): JSX.Element {
  const [inputError, setInputError] = useState<string>('');
  const [localValue, setLocalValue] = useState<number>(initialValue);

  const marginTop: CSSProperties = {marginTop: '50px', textAlign: 'center'};

  function inputChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    valueChanged(Number.parseFloat(event.target.value));
  }

  function sliderChanged(event: ChangeEvent<any>, newValue: number): void {
    valueChanged(newValue);
  }

  function valueChanged(newValue: number): void {
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
      <Grid container style={{minWidth: '300px', minHeight: '100px'}}>
        <Grid item xs={2} style={marginTop}>
          <Typography>{min}</Typography>
        </Grid>
        <Grid item xs={8} style={marginTop}>
          <Slider
            id="value-slider"
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
          <Typography>{max}</Typography>
        </Grid>
        <Grid item xs={12} style={{textAlign: 'center', marginBottom: '20px'}}>
          <TextField
            id="value-input"
            value={localValue}
            onChange={inputChanged}
            type="number"
            inputProps={{
              min: min,
              max: max,
              step: stepSize
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
