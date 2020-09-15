import {Grid, MenuItem, Select} from '@material-ui/core';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import React, {ChangeEvent, useContext, useState} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import WillingnessToTradeOffChart from './WillingnessToTradeOffChart/WillingnessToTradeOffChart';
import values from 'lodash/values';
import _ from 'lodash';

export default function WillingnessToTradeOff() {
  const {disableWeightsButtons, criteria, problem} = useContext(
    PreferencesContext
  );
  const [firstCriterion, setFirstCriterion] = useState<IPreferencesCriterion>(
    values(criteria)[0]
  );
  const [secondCriterion, setSecondCriterion] = useState<IPreferencesCriterion>(
    values(criteria)[1]
  );

  function handleFirstCriterionChanged(
    event: ChangeEvent<{value: string}>
  ): void {
    setFirstCriterion(criteria[event.target.value]);
  }

  function handleSecondCriterionChanged(
    event: ChangeEvent<{value: string}>
  ): void {
    setSecondCriterion(criteria[event.target.value]);
  }

  function getSecondCriterionOptions(): JSX.Element[] {
    return _(criteria)
      .reject(['id', firstCriterion.id])
      .map((criterion: IPreferencesCriterion) => {
        return (
          <MenuItem value={criterion.id} key={criterion.id}>
            {criterion.title}
          </MenuItem>
        );
      })
      .value();
  }

  function getFirstCriterionOptions(): JSX.Element[] {
    return _(criteria)
      .reject(['id', secondCriterion.id])
      .map((criterion: IPreferencesCriterion) => {
        return (
          <MenuItem value={criterion.id} key={criterion.id}>
            {criterion.title}
          </MenuItem>
        );
      })
      .value();
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <h4>Willingness to trade off</h4>
      </Grid>
      <Grid item xs={3}>
        First criterion
      </Grid>
      <Grid item xs={3}>
        Second criterion
      </Grid>
      <Grid item xs={6} />
      <Grid item xs={3}>
        <Select
          value={firstCriterion.id}
          onChange={handleFirstCriterionChanged}
          fullWidth
          disabled={disableWeightsButtons}
        >
          {getFirstCriterionOptions()}
        </Select>
      </Grid>
      <Grid item xs={3}>
        <Select
          value={secondCriterion.id}
          onChange={handleSecondCriterionChanged}
          fullWidth
          disabled={disableWeightsButtons}
        >
          {getSecondCriterionOptions()}
        </Select>
      </Grid>
      <Grid item xs={6} />
      <Grid container item xs={12}>
        {disableWeightsButtons ? (
          <span className="alert">'Not all pvfs are set'</span>
        ) : (
          <WillingnessToTradeOffChart
            firstCriterion={problem.criteria[firstCriterion.id]}
            secondCriterion={problem.criteria[secondCriterion.id]}
          />
        )}
      </Grid>
    </Grid>
  );
}
