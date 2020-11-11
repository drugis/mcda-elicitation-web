import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import DisplayErrors from 'app/ts/util/DisplayErrors';
import React, {useContext, useState} from 'react';
import {AddSubproblemContext} from '../AddSubproblemContext';
import AddSubproblemEffectsTable from '../AddSubproblemEffectsTable/AddSubproblemEffectsTable';
import AddSubproblemScaleRanges from '../AddSubproblemScaleRanges/AddSubproblemScaleRanges';
import SubproblemTitle from '../SubproblemTitle/SubproblemTitle';
import ResetButton from './ResetButton/ResetButton';

export default function AddSubproblemDialog({
  isDialogOpen,
  closeDialog
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
}) {
  const handleKey = createEnterHandler(handleButtonClick, isDisabled);

  const {errors, addSubproblem} = useContext(AddSubproblemContext);
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);

  function isDisabled(): boolean {
    return errors.length > 0 || isButtonPressed;
  }

  function handleButtonClick(): void {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      closeDialog();
      addSubproblem();
    }
  }

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth={'lg'}>
      <DialogTitleWithCross id="add-subproblem-header" onClose={closeDialog}>
        Add new problem <InlineHelp helpId="add-subproblem" />
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <SubproblemTitle handleKeyCallback={handleKey} />
          </Grid>
          <Grid item xs={12}>
            <ResetButton />
          </Grid>
          <Grid item xs={12}>
            <AddSubproblemEffectsTable />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'h5'}>Scale ranges</Typography>
            <AddSubproblemScaleRanges />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={1}>
          <DisplayErrors errors={errors} identifier="add-subproblem" />
          <Grid item xs={12} style={{textAlign: 'end'}}>
            <Button
              id={'add-subproblem-confirm-button'}
              variant="contained"
              color="primary"
              onClick={handleButtonClick}
              disabled={isDisabled()}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
