import {
  Dialog,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import IAlternative from '@shared/interface/IAlternative';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {LegendContext} from '../LegendContext';

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

  const tooltip = legend ? 'show legend' : 'bla bla';

  useEffect(() => {
    if (isDialogOpen) {
      setIsButtonPressed(false);
    }
    initLegend(legend, filteredAlternatives);
  }, [isDialogOpen]);

  function initLegend(
    legend: Record<string, string>,
    alternatives: IAlternative[]
  ): Record<string, string> {
    return legend
      ? legend
      : _(alternatives).keyBy('id').mapValues('title').value();
  }

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

  function handleSingleLettersClick(): void {
    let letterValue = 65;
    setNewTitles(
      _.mapValues(newTitles, (newTitle) => String.fromCharCode(letterValue++))
    );
  }

  function handleResetClick(): void {
    setNewTitles(
      _(filteredAlternatives).keyBy('id').mapValues('title').value()
    );
  }

  return (
    <>
      <Grid item xs={8}>
        {children}
      </Grid>
      <Grid container item xs={4} alignContent="flex-start">
        <Tooltip title={tooltip}>
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
            <Grid container>
              <Grid item xs={12}>
                <Button
                  id="single-letter-button"
                  color="primary"
                  onClick={handleSingleLettersClick}
                  variant="contained"
                >
                  Single-letter labels
                </Button>
                <Button
                  id="reset-labels-button"
                  color="primary"
                  onClick={handleResetClick}
                  variant="contained"
                >
                  Reset to original names
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Original name</TableCell>
                      <TableCell></TableCell>
                      <TableCell>New name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {_.map(
                      filteredAlternatives,
                      (
                        alternative: IAlternative,
                        index: number
                      ): JSX.Element => (
                        <TableRow key={alternative.id}>
                          <TableCell>{alternative.title}</TableCell>
                          <TableCell>
                            <ArrowRightAltIcon />
                          </TableCell>
                          <TableCell>
                            <TextField
                              id={`label-input-${index}`}
                              value={newTitles[alternative.id]}
                              onChange={_.partial(
                                handleLegendChange,
                                alternative.id
                              )}
                              type="text"
                              error={!newTitles[alternative.id]}
                              onKeyDown={handleKey}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
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
