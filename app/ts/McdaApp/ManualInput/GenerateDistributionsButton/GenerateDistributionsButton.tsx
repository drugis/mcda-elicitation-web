import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Tooltip from '@material-ui/core/Tooltip';
import {useContext, useState} from 'react';
import DialogTitleWithCross from '../../../util/SharedComponents/DialogTitleWithCross/DialogTitleWithCross';
import {ManualInputContext} from '../ManualInputContext';

export default function GenerateDistributionsButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {generateDistributions, setTableInputMode} =
    useContext(ManualInputContext);

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
        <Button
          id="generate-distributions"
          color="primary"
          variant="contained"
          onClick={openDialog}
          size="small"
        >
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
            id="confirm-generating-distributions"
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
