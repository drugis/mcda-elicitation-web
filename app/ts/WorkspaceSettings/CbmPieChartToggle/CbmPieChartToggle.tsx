import {Checkbox, Grid, Typography} from '@material-ui/core';
import {WorkspaceSettingsContext} from 'app/ts/McdaApp/Workspace/WorkspaceSettings/WorkspaceSettingsContext/WorkspaceSettingsContext';
import {ChangeEvent, useContext} from 'react';

export default function CbmPieChartToggle(): JSX.Element {
  const {
    localSettings: {showCbmPieChart},
    setSetting
  } = useContext(WorkspaceSettingsContext);

  function handleRadioChanged(event: ChangeEvent<HTMLInputElement>): void {
    setSetting('showCbmPieChart', event.target.checked);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        <Typography>Show pie chart during choice-based matching</Typography>
      </Grid>
      <Grid item xs={6} id="cbm-pie-chart-toggle">
        <Checkbox
          checked={showCbmPieChart}
          onChange={handleRadioChanged}
          color="primary"
        />
      </Grid>
    </Grid>
  );
}
