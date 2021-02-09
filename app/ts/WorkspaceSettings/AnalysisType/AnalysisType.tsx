import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent} from 'react';

export default function AnalysisType({
  analysisType,
  handleRadioChanged
}: {
  analysisType: TAnalysisType;
  handleRadioChanged: (event: ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <>
      <Grid item xs={12}>
        Analysis type <InlineHelp helpId="analysis-type" />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="analysis-type-radio"
          value={analysisType}
          onChange={handleRadioChanged}
        >
          <label>
            <Radio id="deterministic-radio" value="deterministic" />{' '}
            Deterministic
          </label>
          <label>
            <Radio id="smaa-radio" value="smaa" /> SMAA
          </label>
        </RadioGroup>
      </Grid>
    </>
  );
}
