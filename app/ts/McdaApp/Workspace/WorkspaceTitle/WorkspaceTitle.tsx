import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import React, {ChangeEvent, useContext, useState} from 'react';
import DialogTitleWithCross from '../../../DialogTitleWithCross/DialogTitleWithCross';
import createEnterHandler from '../../../util/createEnterHandler';
import DisplayErrors from '../../../util/DisplayErrors';
import {WorkspaceContext} from '../WorkspaceContext/WorkspaceContext';

export default function WorkspaceTitle() {
  const {workspace, editTitle} = useContext(WorkspaceContext);
  const [title, setTitle] = useState<string>(workspace.properties.title);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);

  const handleKey = createEnterHandler(handleButtonClick, isDisabled);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setTitle(workspace.properties.title);
    setIsButtonPressed(false);
    setIsDialogOpen(true);
  }

  function isDisabled(): boolean {
    return !title || isButtonPressed;
  }

  function handleButtonClick(): void {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      closeDialog();
      editTitle(title);
    }
  }

  function titleChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setTitle(event.target.value);
  }

  return (
    <Grid container>
      <Grid item>
        <Typography id="workspace-title" variant="h4">
          {workspace.properties.title}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Edit title">
          <IconButton id="edit-workspace-title-button" onClick={openDialog}>
            <Edit color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Edit title
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                label="new title"
                id="new-workspace-title"
                value={title}
                onChange={titleChanged}
                onKeyDown={handleKey}
                variant="outlined"
                autoFocus
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
            <DisplayErrors
              errors={title ? [] : ['Empty title']}
              identifier="title"
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="edit-workspace-title-confirm-button"
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            disabled={isDisabled()}
            size="small"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
