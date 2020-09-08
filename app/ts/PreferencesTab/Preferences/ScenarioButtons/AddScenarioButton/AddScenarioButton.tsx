import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import React, {ChangeEvent, useContext, useState} from 'react';
import {checkScenarioTitleErrors, showErrors} from '../ScenarioUtil';
import _ from 'lodash';

export default function AddScenarioButton() {
  const {addScenario, scenarios} = useContext(PreferencesContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  let errors: string[] = checkScenarioTitleErrors(title, scenarios);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function handleCreateButtonClick(): void {
    addScenario(title);
    closeDialog();
  }

  function titleChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setTitle(event.target.value);
    errors = checkScenarioTitleErrors(event.target.value, scenarios);
  }

  return (
    <>
      <Tooltip title="Create clean scenario">
        <IconButton onClick={openDialog} id="create-scenario-button">
          <Add color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Add clean scenario
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={9}>
              <TextField
                label="new title"
                id="new-scenario-title"
                value={title}
                onChange={titleChanged}
                fullWidth
                variant="outlined"
              ></TextField>
            </Grid>
            {showErrors(errors)}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="create-new-scenario-button"
            variant="contained"
            color="primary"
            onClick={handleCreateButtonClick}
            disabled={errors.length > 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
