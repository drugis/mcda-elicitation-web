import {Button, Checkbox, Grid} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function ToggledColumns(): JSX.Element {
  const {
    localShowDescriptions,
    localShowUnitsOfMeasurement,
    localShowReferences,
    localShowStrengthsAndUncertainties,
    setLocalShowDescriptions,
    setLocalShowUnitsOfMeasurement,
    setLocalShowReferences,
    setLocalShowStrengthsAndUncertainties
  } = useContext(WorkspaceSettingsContext);

  function handleShowDescriptionsChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setLocalShowDescriptions(event.target.checked);
  }

  function handleShowUnitsChanged(event: ChangeEvent<HTMLInputElement>): void {
    setLocalShowUnitsOfMeasurement(event.target.checked);
  }

  function handleShowReferencesChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setLocalShowReferences(event.target.checked);
  }

  function handleShowStrengthChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setLocalShowStrengthsAndUncertainties(event.target.checked);
  }

  function toggleSelection(): void {
    const areAllSelected =
      localShowDescriptions &&
      localShowUnitsOfMeasurement &&
      localShowReferences &&
      localShowStrengthsAndUncertainties;

    if (areAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }

  function selectAll(): void {
    setAllTo(true);
  }

  function deselectAll(): void {
    setAllTo(false);
  }

  function setAllTo(newValue: boolean) {
    setLocalShowDescriptions(newValue);
    setLocalShowUnitsOfMeasurement(newValue);
    setLocalShowReferences(newValue);
    setLocalShowStrengthsAndUncertainties(newValue);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        Effects table columns to show <InlineHelp helpId="toggled-columns" />
      </Grid>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <Button
            id="toggle-selection-button"
            variant="contained"
            color="primary"
            onClick={toggleSelection}
          >
            (De)select all
          </Button>
        </Grid>
        <Grid item xs={12}>
          {' '}
          <label id="description-column-checkbox">
            <Checkbox
              checked={localShowDescriptions}
              onChange={handleShowDescriptionsChanged}
              color="primary"
            />{' '}
            Description
          </label>
        </Grid>
        <Grid item xs={12}>
          {' '}
          <label id="units-column-checkbox">
            <Checkbox
              checked={localShowUnitsOfMeasurement}
              onChange={handleShowUnitsChanged}
              color="primary"
            />{' '}
            Units
          </label>
        </Grid>
        <Grid item xs={12}>
          {' '}
          <label id="reference-column-checkbox">
            <Checkbox
              checked={localShowReferences}
              onChange={handleShowReferencesChanged}
              color="primary"
            />{' '}
            Reference
          </label>
        </Grid>
        <Grid item xs={12}>
          <label id="uncertainties-column-checkbox">
            <Checkbox
              checked={localShowStrengthsAndUncertainties}
              onChange={handleShowStrengthChanged}
              color="primary"
            />{' '}
            Strength of evidence / Uncertainties
          </label>
        </Grid>
      </Grid>
    </Grid>
  );
}
