import {Grid} from '@material-ui/core';
import React from 'react';
import AddCriterion from './AddCriterion/AddCriterion';
import Favourability from './Favourability/Favourability';

export default function Criteria() {
  return (
    <Grid item container xs={12}>
      <Grid item xs={12}>
        <h4>Criteria</h4>
      </Grid>
      <Favourability />
      <AddCriterion />
      <Grid item xs={12}>
        {/* <criterion-list> is-input="true" edit-mode="editMode"></criterion-list> */}
      </Grid>
    </Grid>
  );
}
