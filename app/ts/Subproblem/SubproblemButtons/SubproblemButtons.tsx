import {IconButton} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';
import React from 'react';
import DeleteSubproblemButton from './DeleteSubproblemButton/DeleteSubproblemButton';
import EditSubproblemButton from './EditSubproblemButton/EditSubproblemButton';

export default function SubproblemButtons({
  createDialogCallback
}: {
  createDialogCallback: () => void;
}) {
  return (
    <Grid item container>
      <Grid item xs={3} />
      <Grid item xs={9}>
        <EditSubproblemButton />
        <IconButton
          id={'add-subproblem-button'}
          color={'primary'}
          onClick={createDialogCallback}
        >
          <Add />
        </IconButton>
        <DeleteSubproblemButton />
      </Grid>
    </Grid>
  );
}
