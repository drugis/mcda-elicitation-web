import {Grid, Typography} from '@material-ui/core';
import React from 'react';
import {TradeOffContextProviderComponent} from './TradeOffContext/TradeOffContext';
import TradeOffReferenceCriterion from './TradeOffReferenceCriterion/TradeOffReferenceCriterion';
import TradeOffReferenceCriterionStatement from './TradeOffReferenceCriterionStatement/TradeOffReferenceCriterionStatement';
import TradeOffTable from './TradeOffTable/TradeOffTable';

export default function TradeOff(): JSX.Element {
  return (
    <Grid item xs={12}>
      <TradeOffContextProviderComponent>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5">Trade off</Typography>
          </Grid>
          <Grid container item xs={12}>
            <TradeOffReferenceCriterion />
          </Grid>
          <Grid item xs={12}>
            <TradeOffReferenceCriterionStatement />
          </Grid>
          <Grid item xs={12}>
            <TradeOffTable />
          </Grid>
        </Grid>
      </TradeOffContextProviderComponent>
    </Grid>
  );
}
