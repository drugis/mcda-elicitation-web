import {Button, Dialog, Grid, DialogContent} from '@material-ui/core';
import React, {useState} from 'react';
import DialogTitle from '../../../../DialogTitle/DialogTitle';

export default function AddCriterion() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function toggleDialog() {
    setIsDialogOpen(!isDialogOpen);
  }

  return (
    <Grid item xs={12}>
      <Button
        id="add-criterion-button"
        variant="contained"
        color="primary"
        onClick={toggleDialog}
      >
        Add Criterion
      </Button>
      <Dialog
        open={isDialogOpen}
        onClose={toggleDialog}
        fullWidth
        maxWidth={'md'}
      >
        <DialogTitle id="add-criterion-dialog" onClose={toggleDialog}>
          Add Criterion
        </DialogTitle>
        <DialogContent>
          Criterion title
          Favourability
          etc
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
