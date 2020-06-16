import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select
} from '@material-ui/core';
import React, {ChangeEvent, MouseEvent, useContext} from 'react';
import DialogTitle from '../../../../../../../../DialogTitle/DialogTitle';
import {Effect, effectType} from '../../../../../../../../interface/IEffect';
import {EffectCellContext} from '../EffectCellContext/EffectCellContext';
import EffectInputFields from './EffectInputFields/EffectInputFields';

export default function EffectCellDialog({
  isDialogOpen,
  callback,
  cancel
}: {
  isDialogOpen: boolean;
  callback: (effectValue: Effect) => void;
  cancel: (event: MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) {
  const {inputType, setInputType, isEditDisabled} = useContext(
    EffectCellContext
  );

  function handleTypeChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setInputType(event.target.value as effectType);
  }

  function handleEditButtonClick(): void {
    const newEffectValue = {} as Effect;
    callback(newEffectValue);
  }

  return (
    <Dialog open={isDialogOpen} onClose={cancel} fullWidth maxWidth={'sm'}>
      <DialogTitle id="dialog-title" onClose={cancel}>
        Set value
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            Input parameters
          </Grid>
          <Grid item xs={6}>
            <Select
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
          <EffectInputFields />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justify="flex-start">
          <Grid item>
            <Button
              color="primary"
              onClick={handleEditButtonClick}
              variant="contained"
              disabled={isEditDisabled}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
