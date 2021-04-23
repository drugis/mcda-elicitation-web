import {Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Delete from '@material-ui/icons/Delete';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SubproblemsContext} from 'app/ts/McdaApp/Workspace/SubproblemsContext/SubproblemsContext';
import _ from 'lodash';
import React, {useContext, useState} from 'react';

export default function DeleteSubproblemButton() {
  const {subproblems, deleteSubproblem} = useContext(SubproblemsContext);
  const {currentSubproblem} = useContext(CurrentSubproblemContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDeleteDisabled = _.values(subproblems).length < 2;

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function handleDeleteButtonClick() {
    deleteSubproblem(currentSubproblem.id);
    closeDialog();
  }

  return (
    <>
      <Tooltip title={'Delete subproblem'}>
        <span>
          <IconButton
            id="delete-subproblem-button"
            onClick={openDialog}
            disabled={isDeleteDisabled}
            size="small"
          >
            <Delete color={isDeleteDisabled ? 'disabled' : 'secondary'} />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross
          id="delete-subproblem-header"
          onClose={closeDialog}
        >
          Delete subproblem
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Typography>
                Are you certain you want to permanently delete{' '}
                <i>{currentSubproblem.title}</i>?
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="delete-subproblem-confirm-button"
            variant="contained"
            color="secondary"
            onClick={handleDeleteButtonClick}
            size="small"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
