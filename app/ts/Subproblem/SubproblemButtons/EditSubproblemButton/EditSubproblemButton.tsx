import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {showErrors} from 'app/ts/PreferencesTab/Preferences/ScenarioButtons/ScenarioUtil';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {checkSubproblemTitleErrors} from '../../SubproblemUtil';

export default function EditSubproblemButton({}: {}) {
  const {currentSubproblem, subproblems, editTitle} = useContext(
    WorkspaceContext
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [errors, setErrors] = useState<string[]>(
    checkSubproblemTitleErrors(title, subproblems, currentSubproblem.id)
  );

  useEffect(() => {
    setErrors(
      checkSubproblemTitleErrors(title, subproblems, currentSubproblem.id)
    );
  }, [title]);

  const handleKey = createEnterHandler(handleButtonClick, isDisabled);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setTitle(currentSubproblem.title);
    setIsDialogOpen(true);
  }

  function titleChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setTitle(event.target.value);
  }

  function handleButtonClick(): void {
    editTitle(title);
    closeDialog();
  }

  function isDisabled(): boolean {
    return errors.length > 0;
  }

  return (
    <>
      <Tooltip title={'Edit problem'}>
        <IconButton
          id={'edit-subproblem-button'}
          color="primary"
          onClick={openDialog}
        >
          <Edit />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          Edit problem title
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                label="new title"
                id="subproblem-title-input"
                value={title}
                onChange={titleChanged}
                onKeyDown={handleKey}
                autoFocus
                fullWidth
              />
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
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}