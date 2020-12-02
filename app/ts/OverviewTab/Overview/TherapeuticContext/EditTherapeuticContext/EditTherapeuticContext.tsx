import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {ChangeEvent, useContext, useState} from 'react';

export default function EditTherapeuticContext() {
  const {therapeuticContext, editTherapeuticContext} = useContext(
    WorkspaceContext
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [
    localTherapeuticContext,
    setLocalTherapeuticContext
  ] = useState<string>('');
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);

  const handleKey = createEnterHandler(handleButtonClick, () => {
    return false;
  });

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setLocalTherapeuticContext(therapeuticContext);
    setIsDialogOpen(true);
  }

  function therapeuticContextChanged(
    event: ChangeEvent<HTMLTextAreaElement>
  ): void {
    setLocalTherapeuticContext(event.target.value);
  }

  function handleButtonClick(): void {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      closeDialog();
      editTherapeuticContext(localTherapeuticContext);
    }
  }

  return (
    <>
      <Tooltip title={'Edit therapeutic context'}>
        <IconButton
          id={'edit-therapeutic-context-button'}
          color="primary"
          onClick={openDialog}
        >
          <Edit />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Edit therapeutic context
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                label="new therapeutic context"
                id="therapeutic-context-input"
                value={localTherapeuticContext}
                onChange={therapeuticContextChanged}
                variant="outlined"
                onKeyDown={handleKey}
                autoFocus
                multiline
                rows={5}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id={'edit-therapeutic-context-confirm-button'}
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
