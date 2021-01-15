import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import DisplayErrors from 'app/ts/util/DisplayErrors';
import {getTitleError} from 'app/ts/util/getTitleError';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';

export default function ScenarioActionButton({
  action,
  icon,
  callback,
  idOfScenarioBeingEdited
}: {
  action: string;
  icon: JSX.Element;
  callback: (newTitle: string) => void;
  idOfScenarioBeingEdited?: string;
}) {
  const {currentScenario, scenarios} = useContext(PreferencesContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string>(
    getTitleError(title, scenarios, idOfScenarioBeingEdited)
  );
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);

  useEffect(() => {
    setError(getTitleError(title, scenarios, idOfScenarioBeingEdited));
  }, [title]);

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
    setTitle(idOfScenarioBeingEdited ? currentScenario.title : '');
    setIsDialogOpen(true);
  }

  function titleChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setTitle(event.target.value);
  }

  function handleButtonClick(): void {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      closeDialog();
      callback(title);
    }
  }

  function isDisabled(): boolean {
    return !!error || isButtonPressed;
  }

  return (
    <>
      <Tooltip title={action + ' scenario'}>
        <IconButton
          id={action.toLowerCase() + '-scenario-button'}
          onClick={openDialog}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          {action} scenario
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={9}>
              <TextField
                label="new title"
                id="new-scenario-title"
                value={title}
                onChange={titleChanged}
                onKeyDown={handleKey}
                autoFocus
                fullWidth
              />
            </Grid>
            <DisplayErrors errors={[error]} identifier="title" />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id={action.toLowerCase() + '-scenario-confirm-button'}
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            disabled={isDisabled()}
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
