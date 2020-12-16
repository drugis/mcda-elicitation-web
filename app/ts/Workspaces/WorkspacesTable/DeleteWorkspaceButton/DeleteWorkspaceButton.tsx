import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Tooltip
} from '@material-ui/core';
import React, {useContext, useState} from 'react';
import Delete from '@material-ui/icons/Delete';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import Axios from 'axios';
import {ErrorContext} from 'app/ts/Error/ErrorContext';

export default function DeleteWorkspaceButton({
  workspace,
  deleteLocalWorkspace
}: {
  workspace: IOldWorkspace;
  deleteLocalWorkspace: (workspaceId: string) => void;
}): JSX.Element {
  const {setError} = useContext(ErrorContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function handleDeleteButtonClick() {
    Axios.delete(`/workspaces/${workspace.id}`).catch(setError);
    deleteLocalWorkspace(workspace.id);
    closeDialog();
  }

  return (
    <>
      <Tooltip title={'Delete workspace'}>
        <span>
          <IconButton
            id="delete-workspace-button"
            size="small"
            onClick={openDialog}
          >
            <Delete color="secondary" />
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
          Delete workspace
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              Are you certain you want to permanently delete:{' '}
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={11}>
              <i>{workspace.title}</i>
            </Grid>
            <Grid item xs={12} className="alert">
              This cannot be undone!
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="delete-workspace-confirm-button"
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
