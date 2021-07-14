import {Box, Grid, Paper, Typography} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import React, {useContext, useEffect} from 'react';
import {AdvancedPartialValueFunctionContext} from './AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';
import AdvancedPvfButtons from './AdvancedPvfButtons/AdvancedPvfButtons';
import AdvancedPvfPlot from './AdvancedPvfPlot/AdvancedPvfPlot';
import AdvancedPvfStatements from './AdvancedPvfStatements/AdvancedPvfStatements';
import CutOffs from './CutOffs/CutOffs';
import PvfDirection from './PvfDirection/PvfDirection';

export default function AdvancedPartialValueFunction(): JSX.Element {
  const {advancedPvfCriterion} = useContext(
    AdvancedPartialValueFunctionContext
  );

  useEffect(() => {
    document.title = `${advancedPvfCriterion.title}'s partial value function`;
  }, [advancedPvfCriterion.title]);

  return (
    <Grid container justify="center" component={Box} mt={2}>
      <Grid container item spacing={4} sm={12} md={9} component={Paper}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Define{' '}
            <InlineHelp helpId="partial-value-function">
              Partial Value Function
            </InlineHelp>{' '}
            for: {advancedPvfCriterion.title}{' '}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <PvfDirection />
        </Grid>
        <Grid item container xs={12} justify="flex-start">
          <AdvancedPvfPlot />
        </Grid>
        <Grid item container xs={12} justify="flex-start">
          <CutOffs />
        </Grid>
        <Grid item container xs={12} justify="flex-start">
          <Typography style={{width: '500px', textAlign: 'center'}}>
            Use the sliders to adjust the shape of the function. They indicate
            for which criterion value (the x-axis) the partial value (the
            y-axis) is 0.25, 0.5 and 0.75, respectively.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <AdvancedPvfStatements />
        </Grid>
        <Grid item xs={12}>
          <AdvancedPvfButtons />
        </Grid>
      </Grid>
    </Grid>
  );
}
