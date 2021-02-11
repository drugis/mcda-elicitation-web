import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper
} from '@material-ui/core';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import React, {useContext} from 'react';
import DisplayMode from '../DisplayMode/DisplayMode';
import RandomSeed from '../RandomSeed/RandomSeed';
import ScalesCalculationMethod from '../ScalesCalculationMethod/ScalesCalculationMethod';
import ShowPercentages from '../ShowPercentages/ShowPercentages';
import ToggledColumns from '../ToggledColumns/ToggledColumns';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function WorkspaceSettingsDialog({
  isDialogOpen,
  closeDialog
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
}): JSX.Element {
  const {isSaveButtonDisabled, resetToDefaults, saveSettings} = useContext(
    WorkspaceSettingsContext
  );

  function handleSaveButtonClicked(): void {
    saveSettings();
    closeDialog();
  }

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth={'md'}>
      <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
        Settings
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <Button
              id="reset-default-button"
              variant="contained"
              color="primary"
              onClick={resetToDefaults}
            >
              Reset to default
            </Button>
          </Grid>
          <Paper>
            <DisplayMode />
          </Paper>
          <Paper>
            <ShowPercentages />
          </Paper>
          <Paper>
            <ScalesCalculationMethod />
          </Paper>
          <Paper>
            <ToggledColumns />
          </Paper>
          <Paper>
            <RandomSeed />
          </Paper>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id="save-settings-button"
          color="primary"
          onClick={handleSaveButtonClicked}
          variant="contained"
          disabled={isSaveButtonDisabled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
