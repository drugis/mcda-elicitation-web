import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TPercentageOrDecimal} from '@shared/interface/Settings/TPercentageOrDecimal';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent} from 'react';

export default function ShowPercentages({
  showPercentages,
  handleRadioChanged
}: {
  showPercentages: TPercentageOrDecimal;
  handleRadioChanged: (event: ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <>
      <Grid item xs={12}>
        Show percentages or decimals (eligible data sources only){' '}
        <InlineHelp helpId="percentages" />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="percentages-radio"
          value={showPercentages}
          onChange={handleRadioChanged}
        >
          <label>
            <Radio id="show-percentages-radio" value="percentage" /> Percentages
          </label>
          <label>
            <Radio id="show-decimals-radio" value="decimal" /> Decimals
          </label>
        </RadioGroup>
      </Grid>
    </>
  );
}
