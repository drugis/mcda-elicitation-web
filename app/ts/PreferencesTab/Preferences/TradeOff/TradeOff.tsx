import {Grid, Typography} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {TradeOffContextProviderComponent} from './TradeOffContext/TradeOffContext';
import TradeOffReferenceCriterion from './TradeOffReferenceCriterion/TradeOffReferenceCriterion';
import TradeOffReferenceCriterionStatement from './TradeOffReferenceCriterionStatement/TradeOffReferenceCriterionStatement';
import TradeOffTable from './TradeOffTable/TradeOffTable';

export default function TradeOff(): JSX.Element {
  const {pvfs} = useContext(PreferencesContext);

  const areAllPvfsLinear = _.every(pvfs, ['type', 'linear']);

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">Trade off</Typography>
      </Grid>
      {areAllPvfsLinear ? (
        <Grid item xs={12}>
          <TradeOffContextProviderComponent>
            <Grid container>
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
      ) : (
        <Grid item xs={12}>
          Trade offs not available for nonlinear partial value functions.
        </Grid>
      )}
    </>
  );
}
