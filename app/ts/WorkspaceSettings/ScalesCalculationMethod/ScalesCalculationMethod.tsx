import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent} from 'react';

export default function ScalesCalculationMethod({
  scalesCalculationMethod,
  handleRadioChanged
}: {
  scalesCalculationMethod: TScalesCalculationMethod;
  handleRadioChanged: (event: ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <>
      <Grid item xs={12}>
        Show median or mode <InlineHelp helpId="median-mode" />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="scales-calculation-method-radio"
          value={scalesCalculationMethod}
          onChange={handleRadioChanged}
        >
          <label>
            <Radio id="show-median-radio" value="median" /> Median
          </label>
          <label>
            <Radio id="show-mode-radio" value="mode" /> Mode
          </label>
        </RadioGroup>
      </Grid>
    </>
  );
}
