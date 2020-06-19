import {Grid, Paper} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext, useEffect} from 'react';
import {ErrorContext} from '../../Error/ErrorContext';
import {ManualInputContext} from '../ManualInputContext';
import DoneButton from './DoneButton/DoneButton';
import EffectOrDistribution from './EffectOrDistribution/EffectOrDistribution';
import Favourability from './Favourability/Favourability';
import GenerateDistributionsButton from './GenerateDistributionsButton/GenerateDistributionsButton';
import ManualInputTable from './ManualInputTable/ManualInputTable';
import TherapeuticContext from './TherapeuticContext/TherapeuticContext';
import Title from './Title/Title';
import Warnings from './Warnings/Warnings';

export default function ManualInput() {
  const {criteria} = useContext(ManualInputContext);
  const {setError} = useContext(ErrorContext);

  useEffect(checkForErrors, [criteria, checkForErrors]);

  function checkForErrors() {
    if (existsCriteriaWithEmptyTitle()) {
      setError('At least one criterion is missing a name');
    } else {
      setError('');
    }
  }

  function existsCriteriaWithEmptyTitle(): boolean {
    return _.some(criteria, {title: ''});
  }

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
        <Grid container item xs={12} spacing={2}>
          <EffectOrDistribution />
        </Grid>
        <Grid item xs={12}>
          <ManualInputTable />
        </Grid>
        <Grid item xs={12}>
          <GenerateDistributionsButton />
        </Grid>
        <Grid container item xs={12}>
          <Warnings />
        </Grid>
        <Grid item xs={12}>
          <DoneButton />
        </Grid>
      </Grid>
    </Grid>
  );
}
