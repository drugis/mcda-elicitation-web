import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function ShowPercentages(): JSX.Element {
  const {
    localSettings: {showPercentages},
    setSetting
  } = useContext(WorkspaceSettingsContext);

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    setSetting('showPercentages', event.target.value);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        <Typography>
          Show{' '}
          <InlineHelp helpId="percentages">percentages or decimals</InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <RadioGroup
          name="percentages-radio"
          value={showPercentages}
          onChange={handleRadioChanged}
        >
          <FormControlLabel
            id="show-percentages-radio"
            value="percentage"
            control={<Radio color="primary" />}
            label="Percentages"
          />
          <FormControlLabel
            id="show-decimals-radio"
            value="decimal"
            control={<Radio color="primary" />}
            label="Decimals"
          />
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
