import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid
} from '@material-ui/core';
import React, {useContext, useEffect, useState} from 'react';
import DialogTitle from '../../../../DialogTitle/DialogTitle';
import ICriterion from '../../../../interface/ICriterion';
import {ManualInputContext} from '../../../ManualInputContext';
import CriterionDescription from './CriterionDescription/CriterionDescription';
import CriterionFavourability from './CriterionFavourability/CriterionFavourability';
import CriterionTitle from './CriterionTitle/CriterionTitle';

export default function AddCriterion() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isFavourable, setIsFavourable] = useState<boolean>(false);

  const {addCriterion} = useContext(ManualInputContext);

  useEffect(resetValues, [isDialogOpen]);

  function resetValues() {
    setTitle('');
    setDescription('');
    setIsFavourable(false);
  }

  function toggleDialog() {
    setIsDialogOpen(!isDialogOpen);
  }

  function handleSaveClick() {
    toggleDialog();
    const criterion: ICriterion = {
      title: title,
      description: description,
      isFavourable: isFavourable
    };
    addCriterion(criterion);
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
          <Grid container spacing={2}>
            <CriterionTitle title={title} setTitle={setTitle} />
            <CriterionDescription
              description={description}
              setDescription={setDescription}
            />
            <CriterionFavourability
              isFavourable={isFavourable}
              setIsFavourable={setIsFavourable}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaveClick}
            color="primary"
            variant="contained"
            disabled={!title}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
