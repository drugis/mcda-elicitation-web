import {Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import {Effect, effectType} from '@shared/interface/IEffect';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import IRangeEffect from '@shared/interface/IRangeEffect';
import ITextEffect from '@shared/interface/ITextEffect';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {normalizeInputValue} from 'app/ts/McdaApp/ManualInput/ManualInputUtil/ManualInputUtil';
import {ChangeEvent, useContext} from 'react';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';
import {InputCellContext} from '../InputCellContext/InputCellContext';
import EffectInputFields from './EffectInputFields/EffectInputFields';

export default function EffectCellDialog({
  isDialogOpen,
  callback,
  cancel
}: {
  isDialogOpen: boolean;
  callback: (effectValue: Effect) => void;
  cancel: () => void;
}) {
  const {
    alternativeId,
    inputType,
    setInputType,
    value,
    isValidValue,
    lowerBound,
    isValidLowerBound,
    upperBound,
    isValidUpperBound,
    text,
    isNotEstimableLowerBound,
    isNotEstimableUpperBound
  } = useContext(InputCellContext);
  const {criterion, dataSource} = useContext(DataSourceRowContext);
  const unitType = dataSource.unitOfMeasurement.type;

  function handleTypeChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setInputType(event.target.value as effectType);
  }

  function handleEditButtonClick(): void {
    let newEffect = {
      type: inputType,
      criterionId: criterion.id,
      dataSourceId: dataSource.id,
      alternativeId: alternativeId
    };
    switch (inputType) {
      case 'value':
        callback({
          ...newEffect,
          value: normalizeInputValue(value, unitType)
        } as IValueEffect);
        break;
      case 'valueCI':
        callback({
          ...newEffect,
          value: normalizeInputValue(value, unitType),
          lowerBound: normalizeInputValue(lowerBound, unitType),
          upperBound: normalizeInputValue(upperBound, unitType),
          isNotEstimableLowerBound: isNotEstimableLowerBound,
          isNotEstimableUpperBound: isNotEstimableUpperBound
        } as IValueCIEffect);
        break;
      case 'range':
        callback({
          ...newEffect,
          lowerBound: normalizeInputValue(lowerBound, unitType),
          upperBound: normalizeInputValue(upperBound, unitType)
        } as IRangeEffect);
        break;
      case 'text':
        callback({
          ...newEffect,
          text: text
        } as ITextEffect);
        break;
      case 'empty':
        callback(newEffect as IEmptyEffect);
        break;
      default:
        throw `unknown input type ${inputType}`;
    }
  }

  function isInputInvalid(): boolean {
    switch (inputType) {
      case 'value':
        return !isValidValue;
      case 'valueCI':
        return !isValidValue || !isValidLowerBound || !isValidUpperBound;
      case 'range':
        return !isValidLowerBound || !isValidUpperBound;
      case 'text':
        return false;
      case 'empty':
        return false;
    }
  }

  return (
    <Dialog open={isDialogOpen} onClose={cancel} fullWidth maxWidth={'sm'}>
      <DialogTitleWithCross id="dialog-title" onClose={cancel}>
        Set value
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography>Input parameters</Typography>
          </Grid>
          <Grid item xs={6}>
            <Select
              native
              id="input-parameters-selector"
              value={inputType}
              onChange={handleTypeChange}
              style={{minWidth: '198px'}}
            >
              <option value="value">Value</option>
              <option value="valueCI">Value, 95% C.I.</option>
              <option value="range">Range</option>
              <option value="empty">Empty cell</option>
              <option value="text">Text</option>
            </Select>
          </Grid>
          <EffectInputFields
            editButtonCallback={handleEditButtonClick}
            isInputInvalid={isInputInvalid}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id="edit-effect-cell"
          color="primary"
          onClick={handleEditButtonClick}
          variant="contained"
          disabled={isInputInvalid()}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
