import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import DialogTitleWithCross from 'app/ts/util/SharedComponents/DialogTitleWithCross/DialogTitleWithCross';
import {ChangeEvent, useContext, useState} from 'react';
import {WorkspaceContext} from '../../../WorkspaceContext/WorkspaceContext';

export default function EditTherapeuticContextButton() {
  const {therapeuticContext, editTherapeuticContext} =
    useContext(WorkspaceContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localTherapeuticContext, setLocalTherapeuticContext] =
    useState<string>('');
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);

  const handleKey = createEnterHandler(handleButtonClick, () => {
    return false;
  });

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsButtonPressed(false);
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
          size="small"
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
        <DialogTitleWithCross
          id="therapeutic-context-header"
          onClose={closeDialog}
        >
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
            disabled={isButtonPressed}
            size="small"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
