import React, {useState, useContext, ChangeEvent} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import _ from 'lodash';

export default function EditScenarioTitleButton() {
  const {currentScenario, updateScenario} = useContext(PreferencesContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState(currentScenario.title);

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
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="edit-scenario-title-button"
            variant="contained"
            color="primary"
            onClick={handleEditButtonClick}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
