import {Grid, Typography, useControlled} from '@material-ui/core';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {TradeOffContextProviderComponent} from './TradeOffContext/TradeOffContext';
import TradeOffReferenceCriterion from './TradeOffReferenceCriterion/TradeOffReferenceCriterion';
import TradeOffReferenceCriterionStatement from './TradeOffReferenceCriterionStatement/TradeOffReferenceCriterionStatement';
import TradeOffTable from './TradeOffTable/TradeOffTable';

export default function TradeOff(): JSX.Element {
  const {observedRanges} = useContext(SubproblemContext);
  const {pvfs, currentScenario} = useContext(PreferencesContext);

  const areAllPvfsLinear = _.every(pvfs, ['type', 'linear']);
  const canShowTradeOffs =
    areAllPvfsLinear &&
    currentScenario.state.weights &&
    !_.isEqual(observedRanges, {});

  return (
    <>
      <Grid item xs={12}>
        <Typography id="trade-off-header" variant="h5">
          Trade off
        </Typography>
      </Grid>
      {canShowTradeOffs ? (
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
