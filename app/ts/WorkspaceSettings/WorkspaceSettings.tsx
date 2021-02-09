import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Tooltip
} from '@material-ui/core';
import Settings from '@material-ui/icons/Settings';
import IEditMode from '@shared/interface/IEditMode';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TPercentageOrDecimal} from '@shared/interface/Settings/TPercentageOrDecimal';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';
import React, {ChangeEvent, useContext, useState} from 'react';
import DialogTitleWithCross from '../DialogTitleWithCross/DialogTitleWithCross';
import {HelpContextProviderComponent} from '../InlineHelp/HelpContext';
import InlineHelp from '../InlineHelp/InlineHelp';
import {SettingsContext} from '../Settings/SettingsContext';
import {getWarnings} from '../Settings/SettingsUtil';
import DisplayWarnings from '../util/DisplayWarnings';
import AnalysisType from './AnalysisType/AnalysisType';
import DisplayMode from './DisplayMode/DisplayMode';
import ScalesCalculationMethod from './ScalesCalculationMethod/ScalesCalculationMethod';
import ShowPercentages from './ShowPercentages/ShowPercentages';

export default function WorkspaceSettings({
  editMode
}: {
  editMode: IEditMode;
}): JSX.Element {
  const {
    scalesCalculationMethod,
    showPercentages,
    displayMode,
    analysisType,
    hasNoEffects,
    hasNoDistributions,
    isRelativeProblem,
    randomSeed,
    showDescriptions,
    showUnitsOfMeasurement,
    showReferences,
    showStrengthsAndUncertainties
  } = useContext(SettingsContext);

  const [
    localScalesCalculationMethod,
    setLocalScalesCalculationMethod
  ] = useState(scalesCalculationMethod);
  const [
    localShowPercentages,
    setLocalShowPercentages
  ] = useState<TPercentageOrDecimal>(
    showPercentages ? 'percentage' : 'decimal'
  );
  const [localDisplayMode, setLocalDisplayMode] = useState<TDisplayMode>(
    displayMode
  );
  const [localAnalysisType, setLocalAnalysisType] = useState<TAnalysisType>(
    analysisType
  );

  const [localRandomSeed, setLocalRandomSeed] = useState<number>(randomSeed);
  const [localShowDescriptions, setLocalShowDescriptions] = useState<boolean>(
    showDescriptions
  );
  const [
    localShowUnitsOfMeasurement,
    setLocalShowUnitsOfMeasurement
  ] = useState<boolean>(showUnitsOfMeasurement);
  const [localShowReferences, setLocalShowReferences] = useState<boolean>(
    showReferences
  );
  const [
    localShowStrengthsAndUncertainties,
    setLocalShowStrengthsAndUncertainties
  ] = useState<boolean>(showStrengthsAndUncertainties);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [warnings, setWarnings] = useState<string[]>([]);

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
    setLocalShowPercentages(event.target.value as TPercentageOrDecimal);
  }

  function handleDisplayModeChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const newDisplayMode = event.target.value as TDisplayMode;
    setWarnings(
      getWarnings(
        isRelativeProblem,
        newDisplayMode,
        analysisType,
        hasNoEffects,
        hasNoDistributions
      )
    );
    setLocalDisplayMode(newDisplayMode);
  }

  function handleAnalysisTypeChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const newAnalysisType = event.target.value as TAnalysisType;
    setWarnings(
      getWarnings(
        isRelativeProblem,
        displayMode,
        newAnalysisType,
        hasNoEffects,
        hasNoDistributions
      )
    );
    setLocalAnalysisType(newAnalysisType);
  }

  function handleScalesCalculationMethodChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setLocalScalesCalculationMethod(
      event.target.value as TScalesCalculationMethod
    );
  }

  return editMode.canEdit ? (
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
            <ShowPercentages
              showPercentages={localShowPercentages}
              handleRadioChanged={handlePercentagesChanged}
            />
            <DisplayMode
              displayMode={localDisplayMode}
              isRelativeProblem={isRelativeProblem}
              handleRadioChanged={handleDisplayModeChanged}
            />
            <AnalysisType
              analysisType={localAnalysisType}
              handleRadioChanged={handleAnalysisTypeChanged}
            />
            <ScalesCalculationMethod
              scalesCalculationMethod={localScalesCalculationMethod}
              handleRadioChanged={handleScalesCalculationMethodChanged}
            />
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
          <DisplayWarnings warnings={warnings} identifier="settings" />
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
