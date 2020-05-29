import {Grid, Paper} from '@material-ui/core';
import React from 'react';
import Criteria from './Criteria/Criteria';
import TherapeuticContext from './TherapeuticContext/TherapeuticContext';
import Title from './Title/Title';

export default function ManualInputStep1() {
  return (
    <Grid container justify="center">
      <Grid container item spacing={2} sm={12} md={6} component={Paper}>
        <Grid item xs={12}>
          <h3 id="manual-input-header-step1">
            Create workspace manually — step 1 of 2
          </h3>
          <h4>Define criteria and alternatives</h4>
        </Grid>
        <Grid item xs={12}>
          Here you can enter the data for an analysis manually. In this first
          step, create the criteria and alternatives you wish to analyse.
          Alternatives are simply a title, while criteria are more complex.
        </Grid>
        <Title />
        <TherapeuticContext />
        <Criteria />
      </Grid>
    </Grid>
  );
}
