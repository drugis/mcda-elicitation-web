import {Grid} from '@material-ui/core';
import React from 'react';
import AddScenarioButton from './AddScenarioButton/AddScenarioButton';
import CopyScenarioButton from './CopyScenarioButton/CopyScenarioButton';
import DeleteScenarioButton from './DeleteScenarioButton/DeleteScenarioButton';
import EditScenarioTitleButton from './EditScenarioTitleButton/EditScenarioTitleButton';

export default function ScenarioButtons() {
  return (
    <Grid container>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <EditScenarioTitleButton />
        <AddScenarioButton />
        <CopyScenarioButton />
        <DeleteScenarioButton />
      </Grid>
    </Grid>
  );
}
