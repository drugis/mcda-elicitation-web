import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Radio,
  RadioGroup,
  Tooltip
} from '@material-ui/core';
import Settings from '@material-ui/icons/Settings';
import IEditMode from '@shared/interface/IEditMode';
import React, {ChangeEvent, useContext, useState} from 'react';
import DialogTitleWithCross from '../DialogTitleWithCross/DialogTitleWithCross';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import InlineHelp from '../InlineHelp/InlineHelp';
import {SettingsContext} from '../Settings/SettingsContext';

export default function WorkspaceSettings({
  editMode
}: {
  editMode: IEditMode;
}): JSX.Element {
  const {} = useContext(SettingsContext);
  // const [scalesCalculationMethod, setScalesCalculationMethod] = useState(
  //   workspaceSettings.calculationMethod
  // );
  // const [showPercentages, setShowPercentages] = useState<string>(
  //   workspaceSettings.showPercentages ? 'percentage' : 'decimal'
  // );

  // const [displayMode, setdisplayMode] = useState(workspaceSettings.displayMode);
  // const [analysisType, setanalysisType] = useState(
  //   workspaceSettings.analysisType
  // );
  // const [hasNoEffects, sethasNoEffects] = useState(
  //   workspaceSettings.hasNoEffects
  // );
  // const [hasNoDistributions, sethasNoDistributions] = useState(
  //   workspaceSettings.hasNoDistributions
  // );
  // const [isRelativeProblem, setisRelativeProblem] = useState(
  //   workspaceSettings.isRelativeProblem
  // );
  // const [changed, setchanged] = useState(workspaceSettings.changed);
  // const [randomSeed, setrandomSeed] = useState(workspaceSettings.randomSeed);
  // const [showDescriptions, setshowDescriptions] = useState(
  //   toggledColumns.description
  // );
  // const [showUnitsOfMeasurement, setshowUnitsOfMeasurement] = useState(
  //   toggledColumns.units
  // );
  // const [showReferences, setshowReferences] = useState(
  //   toggledColumns.references
  // );
  // const [
  //   showStrengthsAndUncertainties,
  //   setshowStrengthsAndUncertainties
  // ] = useState(toggledColumns.strength);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tooltip = `Change workspace settings`;

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function handleSaveButtonClicked(): void {
    closeDialog();
  }

  function handlePercentagesChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setShowPercentages(event.target.value);
  }

  return editMode.canEdit && workspaceSettings ? (
    <HelpContextProviderComponent>
      <Tooltip title={tooltip}>
        <Button
          id="settings-button"
          variant="contained"
          color="primary"
          onClick={openDialog}
        >
          <Settings /> Settings
        </Button>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'md'}
      >
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
              >
                Reset to default
              </Button>
            </Grid>
            <Grid item xs={12}>
              Show percentages or decimals (eligible data sources only){' '}
              <InlineHelp helpId="percentages" />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                name="percentages-radio"
                value={showPercentages}
                onChange={handlePercentagesChanged}
              >
                <Radio value="percentage" /> Percentages
                <Radio value="decimal" /> Decimals
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              Measurements display mode{' '}
              <InlineHelp helpId="measurements-display-mode" />
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              Analysis type <InlineHelp helpId="analysis-type" />
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              Show median or mode <InlineHelp helpId="median-mode" />
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              Effect table Columns to show{' '}
              <InlineHelp helpId="toggled-columns" />
            </Grid>
            <Grid item xs={12}>
              <Button
                id="toggle-selection-button"
                variant="contained"
                color="primary"
              >
                (De)select all
              </Button>
            </Grid>
            <Grid item xs={12}>
              Set random seed <InlineHelp helpId="random-seed" />
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="save-settings-button"
            color="primary"
            onClick={handleSaveButtonClicked}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </HelpContextProviderComponent>
  ) : (
    <></>
  );
}
