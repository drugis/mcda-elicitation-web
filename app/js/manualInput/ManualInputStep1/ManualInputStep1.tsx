import React from 'react';
import Criteria from './Criteria/Criteria';
import TherapeuticContext from './TherapeuticContext/TherapeuticContext';
import Title from './Title/Title';
import {Grid} from '@material-ui/core';

export default function ManualInputStep1() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h3 id="manual-input-header-step1">
          Create workspace manually — step 1 of 2
        </h3>
        <h4>Define criteria and alternatives</h4>
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={6}>
          Here you can enter the data for an analysis manually. In this first
          step, create the criteria and alternatives you wish to analyse.
          Alternatives are simply a title, while criteria are more complex.
        </Grid>
      </Grid>
      <Title />
      <TherapeuticContext />
      <Criteria />
    </Grid>
  );
}
