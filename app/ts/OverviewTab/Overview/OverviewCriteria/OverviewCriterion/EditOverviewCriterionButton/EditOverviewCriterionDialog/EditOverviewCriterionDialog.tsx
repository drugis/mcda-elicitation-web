import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField
} from '@material-ui/core';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import {OverviewCriterionContext} from 'app/ts/Workspace/OverviewCriterionContext/OverviewCriterionContext';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import _ from 'lodash';
import ICriterion from '@shared/interface/ICriterion';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import {getTitleError} from 'app/ts/util/getTitleError';
import FavourabilitySwitch from '../FavourabilitySwitch/FavourabilitySwitch';

export default function EditOverviewCriterionDialog({
  isDialogOpen,
  setIsDialogOpen
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}) {
  const {editCriterion, criteria} = useContext(WorkspaceContext);
  const {criterion} = useContext(OverviewCriterionContext);

  const [localCriterion, setLocalCriterion] = useState<ICriterion>(
    _.cloneDeep(criterion)
  );
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
  const [error, setError] = useState<string>(
    getTitleError(localCriterion.title, criteria, criterion.id)
  );

  const handleKey = createEnterHandler(handleButtonClick, isDisabled);

  useEffect(() => {
    setError(getTitleError(localCriterion.title, criteria, criterion.id));
  }, [localCriterion]);

  useEffect(() => {
    setIsButtonPressed(false);
    setLocalCriterion(_.cloneDeep(criterion));
  }, [isDialogOpen]);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function OverviewCriterionTitleChanged(
    event: ChangeEvent<HTMLTextAreaElement>
  ): void {
    setLocalCriterion({...localCriterion, title: event.target.value});
  }

  function OverviewCriterionDescriptionChanged(
    event: ChangeEvent<HTMLTextAreaElement>
  ): void {
    setLocalCriterion({...localCriterion, description: event.target.value});
  }

  function handleButtonClick(): void {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      closeDialog();
      editCriterion(localCriterion);
    }
  }

  function isDisabled(): boolean {
    return !!error || isButtonPressed;
  }

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth={'sm'}>
      <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
        Edit criterion
      </DialogTitleWithCross>
      <DialogContent style={{overflow: 'hidden'}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="new title"
              id="criterion-title-input"
              value={localCriterion.title}
              onChange={OverviewCriterionTitleChanged}
              variant="outlined"
              onKeyDown={handleKey}
              autoFocus
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="description"
              id="criterion-description-input"
              value={localCriterion.description}
              onChange={OverviewCriterionDescriptionChanged}
              variant="outlined"
              onKeyDown={handleKey}
              multiline
              rows={5}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FavourabilitySwitch
              criterion={localCriterion}
              setCriterion={setLocalCriterion}
            />
          </Grid>
          <Grid
            id={`title-error`}
            item
            container
            xs={12}
            justify="flex-end"
            className="alert"
          >
            {error}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id={'edit-criterion-confirm-button'}
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          disabled={isDisabled()}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
