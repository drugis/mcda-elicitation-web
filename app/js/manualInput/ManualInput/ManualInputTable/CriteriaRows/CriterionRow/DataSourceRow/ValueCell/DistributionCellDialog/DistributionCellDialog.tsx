import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select
} from '@material-ui/core';
import React, {ChangeEvent, useContext} from 'react';
import DialogTitle from '../../../../../../../../DialogTitle/DialogTitle';
import {distributionType} from '../../../../../../../../interface/IDistribution';
import {DistributionCellContext} from '../DistributionCellContext/DistributionCellContext';
import DistributionInputFields from './DistributionInputFields/DistributionInputFields';

export default function DistributionCellDialog({
  isDialogOpen,
  callback,
  cancel
}: {
  isDialogOpen: boolean;
  callback: () => void;
  cancel: () => void;
}) {
  const {inputType, setInputType} = useContext(DistributionCellContext);

  function handleTypeChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setInputType(event.target.value as distributionType);
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
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="beta">Beta</MenuItem>
              <MenuItem value="gamma">Gamma</MenuItem>
              <MenuItem value="value">Value</MenuItem>
              <MenuItem value="range">Range</MenuItem>
              <MenuItem value="empty">Empty cell</MenuItem>
              <MenuItem value="text">Text</MenuItem>
            </Select>
          </Grid>
          <DistributionInputFields
            editButtonCallback={() => {}}
            isInputInvalid={false}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justify="flex-start">
          <Grid item>
            <Button
              color="primary"
              onClick={() => {}}
              variant="contained"
              disabled={false}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
