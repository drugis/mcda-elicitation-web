import {Grid, TextField} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent, useContext, useState} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function RandomSeed(): JSX.Element {
  const {
    localRandomSeed,
    setLocalRandomSeed,
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
    setLocalRandomSeed(newValue);
  }

  return (
    <>
      <Grid item xs={12}>
        Set random seed <InlineHelp helpId="random-seed" />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="random-seed"
          value={localRandomSeed}
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
    </>
  );
}
