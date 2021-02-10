import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function DisplayMode(): JSX.Element {
  const {setLocalDisplayMode, localDisplayMode} = useContext(
    WorkspaceSettingsContext
  );
  const {isRelativeProblem} = useContext(SettingsContext);

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    const newDisplayMode = event.target.value as TDisplayMode;
    setLocalDisplayMode(newDisplayMode);
  }

  return (
    <>
      <Grid item xs={12}>
        Measurements display mode{' '}
        <InlineHelp helpId="measurements-display-mode" />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="percentages-radio"
          value={localDisplayMode}
          onChange={handleRadioChanged}
        >
          <label id="entered-radio">
            <Radio value="enteredData" disabled={isRelativeProblem} /> Entered
            effects / distributions
          </label>
          <label id="values-radio">
            <Radio value="values" /> Values used for analysis
          </label>
        </RadioGroup>
      </Grid>
    </>
  );
}
