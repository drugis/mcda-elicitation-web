import {Grid, Radio, RadioGroup} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function ShowPercentages(): JSX.Element {
  const {
    localSettings: {showPercentages},
    setSetting
  } = useContext(WorkspaceSettingsContext);

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    setSetting('showPercentages', event.target.value);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        Show percentages or decimals <InlineHelp helpId="percentages" />
      </Grid>
      <Grid item xs={6}>
        <RadioGroup
          name="percentages-radio"
          value={showPercentages}
          onChange={handleRadioChanged}
        >
          <label id="show-percentages-radio">
            <Radio value="percentage" /> Percentages
          </label>
          <label id="show-decimals-radio">
            <Radio value="decimal" /> Decimals
          </label>
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
