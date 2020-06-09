import {Grid, Paper} from '@material-ui/core';
import React from 'react';
import Favourability from './Criteria/Favourability/Favourability';
import ManualInputTable from './ManualInputTable/ManualInputTable';
import TherapeuticContext from './TherapeuticContext/TherapeuticContext';
import Title from './Title/Title';

export default function ManualInput() {
  return (
    <Grid container justify="center">
      <Grid container item spacing={2} xs={12} component={Paper}>
        <Grid item xs={12}>
          <h3 id="manual-input-header-step1">Create workspace manually</h3>
        </Grid>
        <Grid item xs={12}>
          Here you can enter the data for an analysis manually. ..
        </Grid>
        <Grid item xs={12}>
          <Title />
        </Grid>
        <Grid item xs={12}>
          <TherapeuticContext />
        </Grid>
        <Grid item xs={12}>
          <Favourability />
        </Grid>
        <Grid item xs={12}>
          <ManualInputTable />
        </Grid>
      </Grid>
    </Grid>
  );
}
