import {Grid, Typography} from '@material-ui/core';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {TradeOffContextProviderComponent} from './TradeOffContext/TradeOffContext';
import TradeOffReferenceCriterion from './TradeOffReferenceCriterion/TradeOffReferenceCriterion';
import TradeOffReferenceCriterionStatement from './TradeOffReferenceCriterionStatement/TradeOffReferenceCriterionStatement';
import TradeOffTable from './TradeOffTable/TradeOffTable';
import _ from 'lodash';
import IPvf from '@shared/interface/Problem/IPvf';

export default function TradeOff(): JSX.Element {
  const {pvfs} = useContext(PreferencesContext);

  const areAllPvfsLinear = _.every(pvfs, (pvf: IPvf): boolean => {
    return pvf.type === 'linear';
  });

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
          All partial value functions need to be linear in order to explore
          trade offs.
        </Grid>
      )}
    </>
  );
}
