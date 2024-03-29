import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SubproblemsContext} from 'app/ts/McdaApp/Workspace/SubproblemsContext/SubproblemsContext';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import DisplayErrors from 'app/ts/util/SharedComponents/DisplayErrors';
import {getTitleError} from 'app/ts/util/getTitleError';
import DialogTitleWithCross from 'app/ts/util/SharedComponents/DialogTitleWithCross/DialogTitleWithCross';
import {ChangeEvent, useContext, useEffect, useState} from 'react';

export default function EditSubproblemButton() {
  const {subproblems} = useContext(SubproblemsContext);
  const {currentSubproblem, editSubproblem} = useContext(
    CurrentSubproblemContext
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string>(
    getTitleError(title, subproblems, currentSubproblem.id)
  );
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);

  useEffect(() => {
    setError(getTitleError(title, subproblems, currentSubproblem.id));
  }, [currentSubproblem.id, subproblems, title]);

  useEffect(() => {
    if (isDialogOpen) {
      setIsButtonPressed(false);
    }
  }, [isDialogOpen]);

  const handleKey = createEnterHandler(handleButtonClick, isDisabled);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setTitle(currentSubproblem.title);
    setIsDialogOpen(true);
  }

  function titleChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setTitle(event.target.value);
  }

  function handleButtonClick(): void {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      closeDialog();
      editTitle(title);
    }
  }

  function editTitle(title: string): void {
    editSubproblem({...currentSubproblem, title: title});
  }

  function isDisabled(): boolean {
    return !!error || isButtonPressed;
  }

  return (
    <>
      <Tooltip title={'Edit problem'}>
        <IconButton
          id={'edit-subproblem-button'}
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
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Edit problem title
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                label="new title"
                id="subproblem-title-input"
                value={title}
                onChange={titleChanged}
                onKeyDown={handleKey}
                variant="outlined"
                autoFocus
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <DisplayErrors errors={[error]} identifier="title" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id={'edit-subproblem-confirm-button'}
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
    </>
  );
}
