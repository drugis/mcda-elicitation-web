import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import React, {useContext, useState} from 'react';
import {AddSubproblemContext} from './AddSubproblemContext';
import SubproblemTitle from './SubproblemTitle/SubproblemTitle';
import _ from 'lodash';
import AddSubproblemEffectsTable from './AddSubproblemEffectsTable/AddSubproblemEffectsTable';

export default function AddSubproblemButton() {
  const {errors} = useContext(AddSubproblemContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleKey = createEnterHandler(handleButtonClick, isDisabled);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function handleButtonClick(): void {
    console.log('boop');
    closeDialog();
  }

  function isDisabled(): boolean {
    return errors.length > 0;
  }

  function showErrors(): JSX.Element[] {
    return _.map(errors, (error, index) => {
      return (
        <Grid item xs={12} key={`error-${index}`} className="alert">
          {error}
        </Grid>
      );
    });
  }

  return (
    <>
      <Tooltip title={'Add a new problem'}>
        <IconButton
          id={'add-subproblem-button'}
          color={'primary'}
          onClick={openDialog}
        >
          <Add />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'lg'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Add new problem <InlineHelp helpId="add-subproblem" />
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={9}>
              <SubproblemTitle handleKeyCallback={handleKey} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Reset to default
              </Button>
            </Grid>
            <Grid item xs={12}>
              <AddSubproblemEffectsTable />
            </Grid>
            {showErrors()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id={'add-subproblem-confirm-button'}
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            disabled={isDisabled()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
