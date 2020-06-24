import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip
} from '@material-ui/core';
import React, {useContext, useState} from 'react';
import DialogTitleWithCross from '../../DialogTitleWithCross/DialogTitleWithCross';
import {ManualInputContext} from '../ManualInputContext';

export default function GenerateDistributionsButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {generateDistributions, setTableInputMode} = useContext(
    ManualInputContext
  );

  const tooltip = `Generate distribution parameters for SMAA using effect values.
   Any existing distributions will be overwritten.`;

  function openDialog() {
    setIsDialogOpen(true);
  }
  function closeDialog() {
    setIsDialogOpen(false);
  }

  function handleClickGenerate() {
    generateDistributions();
    closeDialog();
    setTableInputMode('distribution');
  }

  return (
    <>
      <Tooltip title={tooltip}>
        <Button color="primary" variant="contained" onClick={openDialog}>
          Generate distributions
        </Button>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Generate distributions
        </DialogTitleWithCross>
        <DialogContent>
          Generating distributions for SMAA will overwrite any existing ones.
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={handleClickGenerate}
            variant="contained"
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
