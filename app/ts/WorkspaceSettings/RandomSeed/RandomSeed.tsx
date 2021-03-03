import {Grid, TextField} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import React, {ChangeEvent, useContext, useState} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function RandomSeed(): JSX.Element {
  const {
    localSettings: {randomSeed},
    setSetting,
    setIsSaveButtonDisabled
  } = useContext(WorkspaceSettingsContext);

  const [inputError, setInputError] = useState<string>('');

  function inputChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const newValue = Number.parseFloat(event.target.value);
    if (isNaN(newValue)) {
      setInputError('Invalid value');
      setIsSaveButtonDisabled(true);
    } else if (newValue < 0 || newValue % 1 > 0) {
      setInputError(`Value must be a positive integer`);
      setIsSaveButtonDisabled(true);
    } else {
      setInputError('');
      setIsSaveButtonDisabled(false);
    }
    setSetting('randomSeed', newValue);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        Set <InlineHelp helpId="random-seed">random seed</InlineHelp>
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="random-seed"
          value={randomSeed}
          onChange={inputChanged}
          type="number"
          inputProps={{
            min: 0,
            step: 1
          }}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
        />
      </Grid>
    </Grid>
  );
}
