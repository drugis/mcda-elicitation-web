import {Grid} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';
import AddCriterion from './AddCriterion/AddCriterion';
import Favourability from './Favourability/Favourability';

export default function Criteria() {
  const {criteria} = useContext(ManualInputContext);
  return (
    <Grid item container xs={12}>
      <Grid item xs={12}>
        <h4>Criteria</h4>
      </Grid>
      <Favourability />
      <AddCriterion />
      <Grid item xs={12}>
        {_.map(criteria, (criterion) => {
          return <div>{criterion.title}</div>;
        })}
      </Grid>
    </Grid>
  );
}
