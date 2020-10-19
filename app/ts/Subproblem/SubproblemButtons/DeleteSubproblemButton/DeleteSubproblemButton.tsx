import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Delete from '@material-ui/icons/Delete';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext, useState} from 'react';

export default function DeleteSubproblemButton() {
  const {subproblems, currentSubproblem, deleteSubproblem} = useContext(
    WorkspaceContext
  );
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
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Delete subproblem
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              Are you certain you want to permanently delete{' '}
              <i>{currentSubproblem.title}</i>?
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="delete-subproblem-confirm-button"
            variant="contained"
            color="secondary"
            onClick={handleDeleteButtonClick}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
