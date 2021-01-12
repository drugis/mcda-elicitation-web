import {Dialog, DialogActions, DialogContent, Tooltip} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {LegendContext} from '../LegendContext';
import LegendButtons from './LegendButtons/LegendButtons';
import LegendTable from './LegendTable/LegendTable';
import {generateLegendTooltip, initLegend} from './LegendUtil';

export default function LegendWrapper({
  children
}: {
  children: any;
}): JSX.Element {
  const {legend, saveLegend} = useContext(LegendContext);
  const {filteredAlternatives} = useContext(SubproblemContext);

  const canEdit = true; //FIXME
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
  const [newTitles, setNewTitles] = useState<Record<string, string>>(
    initLegend(legend, filteredAlternatives)
  );

  const tooltip = generateLegendTooltip(filteredAlternatives, legend, canEdit);

  useEffect(() => {
    if (isDialogOpen) {
      setIsButtonPressed(false);
    }
    setNewTitles(initLegend(legend, filteredAlternatives));
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
      <Grid item xs={8}>
        {children}
      </Grid>
      <Grid container item xs={4} alignContent="flex-start">
        <Tooltip title={<div dangerouslySetInnerHTML={{__html: tooltip}} />}>
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
