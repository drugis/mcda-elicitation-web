import {Card, CardContent, Grid, Typography} from '@material-ui/core';
import React from 'react';
import AddCriterion from './AddCriterion/AddCriterion';
import CriteriaList from './CriteriaList/CriteriaList';
import Favourability from './Favourability/Favourability';

export default function Criteria() {
  return (
    <Grid item xs={12}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">Criteria</Typography>
          <Favourability />
          <AddCriterion />
        </CardContent>
        <CardContent>
          <CriteriaList />
        </CardContent>
      </Card>
    </Grid>
  );
}
