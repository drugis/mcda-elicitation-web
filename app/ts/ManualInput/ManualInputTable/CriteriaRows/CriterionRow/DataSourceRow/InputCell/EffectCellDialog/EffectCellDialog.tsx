import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select
} from '@material-ui/core';
import {Effect, effectType} from '@shared/interface/IEffect';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import IRangeEffect from '@shared/interface/IRangeEffect';
import ITextEffect from '@shared/interface/ITextEffect';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import React, {ChangeEvent, useContext} from 'react';
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
          value: Number.parseFloat(value)
        } as IValueEffect);
        break;
      case 'valueCI':
        callback({
          ...newEffect,
          value: Number.parseFloat(value),
          lowerBound: Number.parseFloat(lowerBound),
          upperBound: Number.parseFloat(upperBound),
          isNotEstimableLowerBound: isNotEstimableLowerBound,
          isNotEstimableUpperBound: isNotEstimableUpperBound
        } as IValueCIEffect);
        break;
      case 'range':
        callback({
          ...newEffect,
          lowerBound: Number.parseFloat(lowerBound),
          upperBound: Number.parseFloat(upperBound)
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
            Input parameters
          </Grid>
          <Grid item xs={6}>
            <Select
              id="input-parameters-selector"
              value={inputType}
              onChange={handleTypeChange}
              style={{minWidth: '198px'}}
            >
              <MenuItem value="value">Value</MenuItem>
              <MenuItem value="valueCI">Value, 95% C.I.</MenuItem>
              <MenuItem value="range">Range</MenuItem>
              <MenuItem value="empty">Empty cell</MenuItem>
              <MenuItem value="text">Text</MenuItem>
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
