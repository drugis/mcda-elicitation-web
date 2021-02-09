import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent} from 'react';

export default function DisplayMode({
  displayMode,
  isRelativeProblem,
  handleRadioChanged
}: {
  displayMode: TDisplayMode;
  isRelativeProblem: boolean;
  handleRadioChanged: (event: ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <>
      <Grid item xs={12}>
        Measurements display mode{' '}
        <InlineHelp helpId="measurements-display-mode" />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="percentages-radio"
          value={displayMode}
          onChange={handleRadioChanged}
        >
          <label>
            <Radio
              id="entered-radio"
              value="enteredData"
              disabled={isRelativeProblem}
            />{' '}
            Entered effects / distributions
          </label>
          <label>
            <Radio id="values-radio" value="values" /> Values used for analysis
          </label>
        </RadioGroup>
      </Grid>
    </>
  );
}
