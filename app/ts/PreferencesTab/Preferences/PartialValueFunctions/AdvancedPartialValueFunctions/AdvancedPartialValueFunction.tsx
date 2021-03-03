import {Grid, Paper, Typography} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import React, {useContext, useEffect} from 'react';
import {AdvancedPartialValueFunctionContext} from './AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';
import AdvancedPvfButtons from './AdvancedPvfButtons/AdvancedPvfButtons';
import AdvancedPvfPlot from './AdvancedPvfPlot/AdvancedPvfPlot';
import CutOffs from './CutOffs/CutOffs';
import PvfDirection from './PvfDirection/PvfDirection';

export default function AdvancedPartialValueFunction(): JSX.Element {
  const {advancedPvfCriterion} = useContext(
    AdvancedPartialValueFunctionContext
  );

  useEffect(() => {
    document.title = `${advancedPvfCriterion.title}'s partial value function`;
  }, []);

  return (
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
      <PvfDirection />
      <AdvancedPvfPlot />
      <CutOffs />
      <AdvancedPvfButtons />
    </Grid>
  );
}
