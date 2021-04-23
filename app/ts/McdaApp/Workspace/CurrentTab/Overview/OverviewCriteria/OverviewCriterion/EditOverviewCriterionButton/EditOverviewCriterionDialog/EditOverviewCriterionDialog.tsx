import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {OverviewCriterionContext} from 'app/ts/McdaApp/Workspace/CurrentTab/Overview/OverviewCriteria/OverviewCriterionContext/OverviewCriterionContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import DisplayErrors from 'app/ts/util/DisplayErrors';
import {getTitleError} from 'app/ts/util/getTitleError';
import _ from 'lodash';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
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
  }, [criteria, criterion.id, localCriterion]);

  useEffect(() => {
    setIsButtonPressed(false);
    setLocalCriterion(_.cloneDeep(criterion));
  }, [criterion, isDialogOpen]);

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
          <DisplayErrors errors={[error]} identifier="title" />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id={'edit-criterion-confirm-button'}
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          disabled={isDisabled()}
          size="small"
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
