import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {useStyles} from 'app/ts/McdaApp/McdaApp';
import {TWorkspaceType} from 'app/ts/McdaApp/Workspaces/TWorkspaceType';
import Axios from 'axios';
import React, {useContext, useState} from 'react';

export default function DeleteWorkspaceButton({
  type,
  workspace,
  deleteLocalWorkspace
}: {
  type: TWorkspaceType;
  workspace: IOldWorkspace | IInProgressWorkspaceProperties;
  deleteLocalWorkspace: (workspaceId: string) => void;
}): JSX.Element {
  const classes = useStyles();

  const {setError} = useContext(ErrorContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function handleDeleteButtonClick() {
    const path = type === 'finished' ? 'workspaces' : 'inProgress';
    Axios.delete(`/api/v2/${path}/${workspace.id}`).catch(setError);
    deleteLocalWorkspace(workspace.id);
    closeDialog();
  }

  return (
    <>
      <Tooltip title={'Delete workspace'}>
        <span>
          <IconButton size="small" onClick={openDialog}>
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
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>
                Are you certain you want to permanently delete:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <i>{workspace.title}</i>
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.alert}>
              <Typography>This cannot be undone!</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="delete-workspace-confirm-button"
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
