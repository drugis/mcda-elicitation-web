import {Grid, InputAdornment, Popover, TextField} from '@material-ui/core';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {getPercentifiedValue} from 'app/ts/util/DisplayUtil/DisplayUtil';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import significantDigits from 'app/ts/util/significantDigits';
import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {EquivalentChangeContext} from '../../EquivalentChangeContext/EquivalentChangeContext';
import {getTheoreticalRange} from '../../equivalentChangeUtil';

export default function EquivalentChangeValueInput({
  usePercentage,
  anchorElement,
  isDialogOpen,
  closeDialog
}: {
  usePercentage: boolean;
  anchorElement: HTMLButtonElement;
  closeDialog: () => void;
  isDialogOpen: boolean;
}): JSX.Element {
  const {referenceCriterion, updateReferenceValueBy} = useContext(
    EquivalentChangeContext
  );
  const {equivalentChange} = useContext(CurrentScenarioContext);
  const {stepSizesByCriterion} = useContext(CurrentSubproblemContext);
  const [inputError, setInputError] = useState<string>('');

  const unit = referenceCriterion.dataSources[0].unitOfMeasurement;
  const [stepSize, setStepSize] = useState<number>(
    usePercentage
      ? stepSizesByCriterion[referenceCriterion.id] * 100
      : stepSizesByCriterion[referenceCriterion.id]
  );
  const [localValue, setLocalValue] = useState<number>(
    getPercentifiedValue(equivalentChange.by, usePercentage)
  );
  const [minValue, maxValue] = getTheoreticalRange(unit, usePercentage);

  useEffect(() => {
    setStepSize(
      getPercentifiedValue(
        stepSizesByCriterion[referenceCriterion.id],
        usePercentage
      )
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
      updateReferenceValueBy(
        significantDigits(usePercentage ? localValue / 100 : localValue)
      );
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
