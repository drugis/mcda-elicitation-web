import {Grid, Typography} from '@material-ui/core';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {CurrentScenarioContext} from '../../../CurrentScenarioContext/CurrentScenarioContext';
import {TradeOffContextProviderComponent} from './TradeOffContext/TradeOffContext';
import TradeOffReferenceCriterion from './TradeOffReferenceCriterion/TradeOffReferenceCriterion';
import TradeOffStatement from './TradeOffStatement/TradeOffStatement';
import TradeOffTable from './TradeOffTable/TradeOffTable';
import TradeOffTypeToggle from './TradeOffTypeToggle/TradeOffTypeToggle';

export default function TradeOff(): JSX.Element {
  const {observedRanges} = useContext(CurrentSubproblemContext);
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);

  const areAllPvfsLinear = _.every(pvfs, ['type', 'linear']);
  const canShowTradeOffs =
    areAllPvfsLinear &&
    currentScenario.state.weights &&
    !_.isEmpty(observedRanges);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography id="trade-off-header" variant="h5">
          <InlineHelp helpId="trade-off-table">Trade off</InlineHelp>
        </Typography>
      </Grid>
      {canShowTradeOffs ? (
        <Grid container item xs={12} spacing={2}>
          <TradeOffContextProviderComponent>
            <Grid item xs={12}>
              <TradeOffTypeToggle />
            </Grid>
            <Grid item xs={12}>
              <TradeOffReferenceCriterion />
            </Grid>
            <Grid item xs={12}>
              <TradeOffStatement />
            </Grid>
            <Grid item xs={12}>
              <TradeOffTable />
            </Grid>
          </TradeOffContextProviderComponent>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Typography>
            Trade offs not available for nonlinear partial value functions.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
