import {Dialog, DialogActions, DialogContent, Tooltip} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import DisplayErrors from 'app/ts/util/DisplayErrors';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {LegendContext} from '../LegendContext';
import LegendButtons from './LegendButtons/LegendButtons';
import LegendTable from './LegendTable/LegendTable';
import LegendTooltip from './LegendTooltip/LegendTooltip';
import {initLegend} from './LegendUtil';

export default function LegendWrapper({
  children
}: {
  children: any;
}): JSX.Element {
  const {canEdit, legendByAlternativeId, saveLegend} = useContext(
    LegendContext
  );
  const {filteredAlternatives} = useContext(SubproblemContext);

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
  const [newTitles, setNewTitles] = useState<Record<string, string>>(
    initLegend(legendByAlternativeId, filteredAlternatives)
  );

  useEffect(() => {
    if (isDialogOpen) {
      setIsButtonPressed(false);
    }
    setNewTitles(initLegend(legendByAlternativeId, filteredAlternatives));
  }, [isDialogOpen]);

  const handleKey = createEnterHandler(handleLegendSave, isDisabled);

  function openDialog(event: React.MouseEvent<HTMLButtonElement>): void {
    setDialogOpen(true);
  }

  function closeDialog(): void {
    setDialogOpen(false);
  }

  function handleLegendChange(
    alternativeId: string,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const newTitle = event.target.value;
    setNewTitles({...newTitles, [alternativeId]: newTitle});
    if (newTitle === '') {
      setError('Names may not be empty.');
    } else {
      setError(undefined);
    }
  }

  function handleLegendSave(): void {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      closeDialog();
      saveLegend(newTitles);
    }
  }

  function isDisabled(): boolean {
    return !!error || isButtonPressed;
  }

  return (
    <>
      <Grid item md={12} lg={8}>
        {children}
      </Grid>
      <Grid container item md={12} lg={4} alignContent="flex-start">
        <Tooltip title={<LegendTooltip />}>
          <Button
            color="primary"
            variant="contained"
            onClick={openDialog}
            disabled={!canEdit}
          >
            Labels
          </Button>
        </Tooltip>
        <Dialog
          open={isDialogOpen}
          onClose={closeDialog}
          fullWidth
          maxWidth={'sm'}
        >
          <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
            Rename alternatives in plots
          </DialogTitleWithCross>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LegendButtons setNewTitles={setNewTitles} />
              </Grid>
              <Grid item xs={12}>
                <LegendTable
                  newTitles={newTitles}
                  handleKey={handleKey}
                  handleLegendChange={handleLegendChange}
                />
              </Grid>
              <DisplayErrors errors={[error]} identifier="missing-title" />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              id="save-legend-button"
              color="primary"
              onClick={handleLegendSave}
              variant="contained"
              disabled={isDisabled()}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
