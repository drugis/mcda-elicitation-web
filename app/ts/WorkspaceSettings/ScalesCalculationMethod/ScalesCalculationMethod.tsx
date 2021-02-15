import {Grid, Radio, RadioGroup} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
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
        Show median or mode <InlineHelp helpId="median-mode" />
      </Grid>
      <Grid item xs={6}>
        <RadioGroup
          name="scales-calculation-method-radio"
          value={calculationMethod}
          onChange={handleRadioChanged}
        >
          <label id="show-median-radio">
            <Radio value="median" /> Median
          </label>
          <label id="show-mode-radio">
            <Radio value="mode" /> Mode
          </label>
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
