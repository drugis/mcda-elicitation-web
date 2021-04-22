import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function ScalesCalculationMethod(): JSX.Element {
  const {
    localSettings: {calculationMethod},
    setSetting
  } = useContext(WorkspaceSettingsContext);

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    setSetting('calculationMethod', event.target.value);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        <Typography>
          Show <InlineHelp helpId="median-mode">median or mode</InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <RadioGroup
          name="scales-calculation-method-radio"
          value={calculationMethod}
          onChange={handleRadioChanged}
        >
          <FormControlLabel
            id="show-median-radio"
            value="median"
            control={<Radio color="primary" />}
            label="Median"
          />
          <FormControlLabel
            id="show-mode-radio"
            value="mode"
            control={<Radio color="primary" />}
            label="Mode"
          />
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
