import {Dialog, DialogActions, DialogContent, Tooltip} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import DisplayErrors from 'app/ts/util/SharedComponents/DisplayErrors';
import DialogTitleWithCross from 'app/ts/util/SharedComponents/DialogTitleWithCross/DialogTitleWithCross';
import {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import {LegendContext} from '../LegendContext';
import LegendButtons from './LegendButtons/LegendButtons';
import LegendTable from './LegendTable/LegendTable';
import LegendTooltip from './LegendTooltip/LegendTooltip';
import {initLegend} from './LegendUtil';

export default function LegendButton({
  buttonId
}: {
  buttonId: string;
}): JSX.Element {
  const {legendByAlternativeId, saveLegend} = useContext(LegendContext);
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

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
  }, [filteredAlternatives, isDialogOpen, legendByAlternativeId]);

  const handleKey = createEnterHandler(handleLegendSave, isDisabled);

  function openDialog(_event: MouseEvent<HTMLButtonElement>): void {
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
    <Grid container item md={12} lg={4} alignContent="flex-start">
      <Tooltip title={<LegendTooltip />}>
        <span>
          <Button
            id={buttonId}
            color="primary"
            variant="contained"
            onClick={openDialog}
            size="small"
            style={{width: '55px'}}
          >
            Labels
          </Button>
        </span>
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
            <Grid item xs={12}>
              <DisplayErrors errors={[error]} identifier="missing-title" />
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
            size="small"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
