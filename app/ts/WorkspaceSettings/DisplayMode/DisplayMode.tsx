import {Grid, Select} from '@material-ui/core';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function DisplayMode(): JSX.Element {
  const {
    localSettings: {displayMode},
    setSetting
  } = useContext(WorkspaceSettingsContext);
  const {isRelativeProblem, hasNoEffects, hasNoDistributions} = useContext(
    SettingsContext
  );

  function handleSelectionChanged(event: ChangeEvent<HTMLInputElement>): void {
    setSetting('displayMode', event.target.value);
  }

  function getDisplayModeOptions(): JSX.Element[] {
    const enteredEffects = (
      <option key="enteredEffects" value={'enteredEffects'}>
        Entered effects
      </option>
    );
    const enteredDistributions = (
      <option key="enteredDistributions" value={'enteredDistributions'}>
        Entered distributions
      </option>
    );
    const deterministicValues = (
      <option key="deterministicValues" value={'deterministicValues'}>
        Values used in deterministic analysis
      </option>
    );
    const smaaValues = (
      <option key="smaaValues" value={'smaaValues'}>
        Values used in SMAA
      </option>
    );
    if (isRelativeProblem) {
      return [deterministicValues, smaaValues];
    } else if (hasNoEffects) {
      return [enteredDistributions, deterministicValues, smaaValues];
    } else if (hasNoDistributions) {
      return [enteredEffects, deterministicValues, smaaValues];
    } else
      return [
        enteredEffects,
        enteredDistributions,
        deterministicValues,
        smaaValues
      ];
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        Measurements display mode{' '}
        <InlineHelp helpId="measurements-display-mode" />
      </Grid>
      <Grid item xs={6}>
        <Select
          native
          id="display-mode-selector"
          value={displayMode}
          onChange={handleSelectionChanged}
          style={{minWidth: 220}}
        >
          {getDisplayModeOptions()}
        </Select>
      </Grid>
    </Grid>
  );
}
