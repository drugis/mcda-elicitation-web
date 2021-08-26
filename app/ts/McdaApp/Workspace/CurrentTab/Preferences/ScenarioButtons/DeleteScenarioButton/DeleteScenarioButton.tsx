import {Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Delete from '@material-ui/icons/Delete';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {ScenariosContext} from 'app/ts/McdaApp/Workspace/ScenariosContext/ScenariosContext';
import _ from 'lodash';
import {useContext, useState} from 'react';

export default function DeleteScenarioButton() {
  const {deleteScenario, scenarios} = useContext(ScenariosContext);
  const {currentScenario} = useContext(CurrentScenarioContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDeleteDisabled = _.values(scenarios).length < 2;

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsDialogOpen(true);
  }

  function handleDeleteButtonClick() {
    deleteScenario(currentScenario.id);
    closeDialog();
  }

  return (
    <>
      <Tooltip title={'Delete scenario'}>
        <span>
          <IconButton
            id="delete-scenario-button"
            onClick={openDialog}
            disabled={isDeleteDisabled}
            size="small"
          >
            <Delete color={isDeleteDisabled ? 'disabled' : 'secondary'} />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Delete scenario
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Typography>
                Are you certain you want to permanently delete{' '}
                <i>{currentScenario.title}</i>?
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id="delete-scenario-confirm-button"
            variant="contained"
            color="secondary"
            onClick={handleDeleteButtonClick}
            size="small"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
