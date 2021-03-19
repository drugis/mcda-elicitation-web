import Grid from '@material-ui/core/Grid';
import React from 'react';
import AddSubproblemButton from './AddSubproblemButton/AddSubproblemButton';
import DeleteSubproblemButton from './DeleteSubproblemButton/DeleteSubproblemButton';
import EditSubproblemButton from './EditSubproblemButton/EditSubproblemButton';

export default function SubproblemButtons() {
  return (
    <Grid item container>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <EditSubproblemButton />
        <AddSubproblemButton />
        <DeleteSubproblemButton />
      </Grid>
    </Grid>
  );
}
