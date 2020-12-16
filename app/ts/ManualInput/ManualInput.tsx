import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, {useEffect} from 'react';
import InlineHelp from '../InlineHelp/InlineHelp';
import DoneButton from './DoneButton/DoneButton';
import EffectOrDistribution from './EffectOrDistribution/EffectOrDistribution';
import Favourability from './Favourability/Favourability';
import GenerateDistributionsButton from './GenerateDistributionsButton/GenerateDistributionsButton';
import ManualInputTable from './ManualInputTable/ManualInputTable';
import ManualInputTherapeuticContext from './ManualInputTherapeuticContext/ManualInputTherapeuticContext';
import Title from './Title/Title';
import Warnings from './Warnings/Warnings';

export default function ManualInput() {
  useEffect(setPageTitle, []);

  function setPageTitle() {
    document.title = 'Manual input';
  }

  return (
    <Grid container justify="center">
      <Grid container item spacing={2} xs={12} component={Paper}>
        <Grid item xs={12}>
          <Typography id="manual-input-header-step1" variant="h3">
            Create workspace manually
          </Typography>
        </Grid>
        <Grid item xs={11}>
          <Title />
        </Grid>
        <Grid item xs={11}>
          <ManualInputTherapeuticContext />
        </Grid>
        <Grid item xs={1}>
          <InlineHelp helpId="therapeutic-context" />
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
        <Grid id="warnings" container item xs={12}>
          <Warnings />
        </Grid>
        <Grid item xs={12}>
          <DoneButton />
        </Grid>
      </Grid>
    </Grid>
  );
}
