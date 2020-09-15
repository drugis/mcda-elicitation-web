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
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import _ from 'lodash';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {checkScenarioTitleErrors, showErrors} from '../ScenarioUtil';

export default function EditScenarioTitleButton() {
  const {currentScenario, updateScenario, scenarios} = useContext(
    PreferencesContext
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState<string>(currentScenario.title);
  const [errors, setErrors] = useState<string[]>(
    checkScenarioTitleErrors(title, scenarios, currentScenario.id)
  );
  useEffect(() => {
    setErrors(checkScenarioTitleErrors(title, scenarios, currentScenario.id));
  }, [title]);

  const handleKey = createEnterHandler(handleEditButtonClick, isDisabled);
  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function titleChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setTitle(event.target.value);
  }

  function handleEditButtonClick(): void {
    updateScenario(_.merge({}, currentScenario, {title: title}));
    closeDialog();
  }

  function isDisabled(): boolean {
    return errors.length > 0;
  }

  return (
    <>
      <Tooltip title="Edit current scenario title">
        <IconButton id="edit-scenario-button" onClick={openDialog}>
          <Edit color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Edit scenario title
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={9}>
              <TextField
                id="new-scenario-title"
                value={title}
                onChange={titleChanged}
                onKeyDown={handleKey}
                fullWidth
              />
            </Grid>
            {showErrors(errors)}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="edit-scenario-title-button"
            variant="contained"
            color="primary"
            onClick={handleEditButtonClick}
            disabled={isDisabled()}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}