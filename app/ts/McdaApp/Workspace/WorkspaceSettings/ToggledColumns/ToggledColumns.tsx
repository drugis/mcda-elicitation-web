import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography
} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import {ChangeEvent, useContext} from 'react';
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
        <Typography>
          <InlineHelp helpId="toggled-columns">
            Effects table columns to show
          </InlineHelp>
        </Typography>
      </Grid>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <Button
            id="toggle-selection-button"
            variant="contained"
            color="primary"
            onClick={toggleSelection}
            size="small"
          >
            (De)select all
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            id="description-column-checkbox"
            control={
              <Checkbox
                checked={description}
                onChange={handleShowDescriptionsChanged}
                color="primary"
              />
            }
            label="Description"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            id="units-column-checkbox"
            control={
              <Checkbox
                checked={units}
                onChange={handleShowUnitsChanged}
                color="primary"
              />
            }
            label="Units"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            id="reference-column-checkbox"
            control={
              <Checkbox
                checked={references}
                onChange={handleShowReferencesChanged}
                color="primary"
              />
            }
            label="Reference"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            id="uncertainties-column-checkbox"
            control={
              <Checkbox
                checked={strength}
                onChange={handleShowStrengthChanged}
                color="primary"
              />
            }
            label="Strength of evidence / Uncertainties"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
