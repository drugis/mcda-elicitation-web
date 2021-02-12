import {Button, Checkbox, Grid} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {ChangeEvent, useContext} from 'react';
import {WorkspaceSettingsContext} from '../WorkspaceSettingsContext/WorkspaceSettingsContext';

export default function ToggledColumns(): JSX.Element {
  const {
    localToggledColumns: {description, references, strength, units},
    setShowColumn,
    setAllColumnsTo
  } = useContext(WorkspaceSettingsContext);

  function handleShowDescriptionsChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setShowColumn('description', event.target.checked);
  }

  function handleShowUnitsChanged(event: ChangeEvent<HTMLInputElement>): void {
    setShowColumn('units', event.target.checked);
  }

  function handleShowReferencesChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setShowColumn('references', event.target.checked);
  }

  function handleShowStrengthChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setShowColumn('strength', event.target.checked);
  }

  function toggleSelection(): void {
    const areAllSelected = description && units && references && strength;
    if (areAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }

  function selectAll(): void {
    setAllColumnsTo(true);
  }

  function deselectAll(): void {
    setAllColumnsTo(false);
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
              checked={description}
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
              checked={units}
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
              checked={references}
              onChange={handleShowReferencesChanged}
              color="primary"
            />{' '}
            Reference
          </label>
        </Grid>
        <Grid item xs={12}>
          <label id="uncertainties-column-checkbox">
            <Checkbox
              checked={strength}
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
