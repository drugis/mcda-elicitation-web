import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function ScalesCalculationMethod(): JSX.Element {
  const {
    localScalesCalculationMethod,
    setLocalScalesCalculationMethod
  } = useContext(WorkspaceSettingsContext);

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    setLocalScalesCalculationMethod(
      event.target.value as TScalesCalculationMethod
    );
  }

  return (
    <>
      <Grid item xs={12}>
        Show median or mode <InlineHelp helpId="median-mode" />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="scales-calculation-method-radio"
          value={localScalesCalculationMethod}
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
    </>
  );
}
