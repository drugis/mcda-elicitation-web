import {Grid, Radio, RadioGroup} from '@material-ui/core';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function AnalysisType(): JSX.Element {
  const {localAnalysisType, setLocalAnalysisType} = useContext(
    WorkspaceSettingsContext
  );

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    const newAnalysisType = event.target.value as TAnalysisType;
    setLocalAnalysisType(newAnalysisType);
  }
  return (
    <>
      <Grid item xs={12}>
        Analysis type <InlineHelp helpId="analysis-type" />
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="analysis-type-radio"
          value={localAnalysisType}
          onChange={handleRadioChanged}
        >
          <label id="deterministic-radio">
            <Radio value="deterministic" /> Deterministic
          </label>
          <label id="smaa-radio">
            <Radio value="smaa" /> SMAA
          </label>
        </RadioGroup>
      </Grid>
    </>
  );
}
