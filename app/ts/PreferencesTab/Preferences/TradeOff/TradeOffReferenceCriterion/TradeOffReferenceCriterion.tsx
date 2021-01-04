import {Grid, Select} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import React, {ChangeEvent, useContext} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import _ from 'lodash';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';

export default function TradeOffReferenceCriterion(): JSX.Element {
  const {referenceCriterion, updateReferenceCriterion} = useContext(
    TradeOffContext
  );
  const {filteredCriteria} = useContext(SubproblemContext);

  function handleReferenceCriterionChanged(
    event: ChangeEvent<{value: string}>
  ): void {
    updateReferenceCriterion(event.target.value);
  }

  function getReferenceCriterionOptions(): JSX.Element[] {
    return _.map(
      filteredCriteria,
      (criterion: ICriterion): JSX.Element => {
        return (
          <option value={criterion.id} key={criterion.id}>
            {criterion.title}
          </option>
        );
      }
    );
  }

  return (
    <>
      <Grid item xs={3}>
        Reference criterion:
      </Grid>
      <Grid item xs={9}>
        <Select
          native
          id="scenario-selector"
          value={referenceCriterion.id}
          onChange={handleReferenceCriterionChanged}
          style={{minWidth: 220}}
        >
          {getReferenceCriterionOptions()}
        </Select>
      </Grid>
    </>
  );
}
