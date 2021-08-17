import {Grid, InputAdornment, Popover, TextField} from '@material-ui/core';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {EquivalentChangeContext} from '../../EquivalentChangeContext/EquivalentChangeContext';
import {getTheoreticalRange} from '../../equivalentChangeUtil';

export default function EquivalentChangeValueInput({
  anchorElement,
  isDialogOpen,
  closeDialog
}: {
  anchorElement: HTMLButtonElement;
  closeDialog: () => void;
  isDialogOpen: boolean;
}): JSX.Element {
  const {referenceValueBy, referenceCriterion, setReferenceValueBy} =
    useContext(EquivalentChangeContext);
  const {stepSizesByCriterion} = useContext(CurrentSubproblemContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const [inputError, setInputError] = useState<string>('');

  const unit = referenceCriterion.dataSources[0].unitOfMeasurement;
  const usePercentage = getUsePercentage(referenceCriterion.dataSources[0]);
  const [stepSize, setStepSize] = useState<number>(
    usePercentage
      ? stepSizesByCriterion[referenceCriterion.id] * 100
      : stepSizesByCriterion[referenceCriterion.id]
  );
  const [localValue, setLocalValue] = useState<number>(
    usePercentage ? referenceValueBy * 100 : referenceValueBy
  );
  const [minValue, maxValue] = getTheoreticalRange(unit, usePercentage);

  useEffect(() => {
    setStepSize(
      usePercentage
        ? stepSizesByCriterion[referenceCriterion.id] * 100
        : stepSizesByCriterion[referenceCriterion.id]
    );
  }, [referenceCriterion.id, stepSizesByCriterion, usePercentage]);

  function inputChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    valueChanged(Number.parseFloat(event.target.value));
  }

  function valueChanged(newValue: number): void {
    if (isNaN(newValue)) {
      setInputError('Invalid value');
    } else if (newValue < minValue || newValue > maxValue) {
      setInputError(`Value must be between ${minValue} and ${maxValue}`);
    } else {
      setInputError('');
    }
    setLocalValue(newValue);
  }

  function handleCloseDialog() {
    if (!inputError) {
      setReferenceValueBy(usePercentage ? localValue / 100 : localValue);
    }
    closeDialog();
  }

  return (
    <Popover
      open={isDialogOpen}
      onClose={handleCloseDialog}
      anchorEl={anchorElement}
      PaperProps={{style: {height: '80px', minWidth: '400px'}}}
    >
      <Grid container>
        <Grid item xs={12} style={{textAlign: 'center', marginTop: '20px'}}>
          <TextField
            id="value-input"
            value={localValue}
            onChange={inputChanged}
            type="number"
            inputProps={{
              min: minValue,
              max: maxValue,
              step: stepSize
            }}
            error={Boolean(inputError)}
            helperText={inputError ? inputError : ''}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {getUnitLabel(unit, usePercentage)}
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
    </Popover>
  );
}
