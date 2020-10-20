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
import {showErrors} from 'app/ts/PreferencesTab/Preferences/ScenarioButtons/ScenarioUtil';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import React, {useContext, useState} from 'react';
import {AddSubproblemContext} from './AddSubproblemContext';
import SubproblemTitle from './SubproblemTitle/SubproblemTitle';

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

  return (
    <>
      <Tooltip title={'Create new problem'}>
        <IconButton
          id={'create-subproblem-button'}
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
          Create new problem <InlineHelp helpId="create-subproblem" />
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              reset button
            </Grid>
            <Grid item xs={12}>
              <SubproblemTitle handleKeyCallback={handleKey} />
            </Grid>
            {showErrors(errors)}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id={'edit-subproblem-confirm-button'}
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            disabled={isDisabled()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
