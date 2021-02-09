import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid
} from '@material-ui/core';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import DisplayWarnings from 'app/ts/util/DisplayWarnings';
import React, {useContext} from 'react';
import AnalysisType from '../AnalysisType/AnalysisType';
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
  const {
    warnings,
    isSaveButtonDisabled,
    resetToDefaults,
    saveSettings
  } = useContext(WorkspaceSettingsContext);

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
          <ShowPercentages />
          <DisplayMode />
          <AnalysisType />
          <ScalesCalculationMethod />
          <ToggledColumns />
          <RandomSeed />
        </Grid>
        <DisplayWarnings warnings={warnings} identifier="settings" />
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
