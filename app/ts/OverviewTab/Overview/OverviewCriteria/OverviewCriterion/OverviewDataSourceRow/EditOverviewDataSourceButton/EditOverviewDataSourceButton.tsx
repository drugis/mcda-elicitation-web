import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Tooltip
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import {OverviewCriterionContext} from 'app/ts/Workspace/OverviewCriterionContext/OverviewCriterionContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {OverviewDataSourceContext} from '../../OverviewDataSourceTable/OverviewDataSourceContext/OverviewDataSourceContext';

export default function EditOverviewDataSourceButton() {
  const {editCriterion} = useContext(WorkspaceContext);
  const {criterion} = useContext(OverviewCriterionContext);
  const {dataSource, index} = useContext(OverviewDataSourceContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localDataSource, setLocalDataSource] = useState<IDataSource>(
    _.cloneDeep(dataSource)
  );
  const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setError(getError());
  }, [localDataSource]);

  const handleKey = createEnterHandler(handleButtonClick, isDisabled);

  function getError(): string {
    if (hasMissingReference()) {
      return 'Missing reference';
    } else if (hasDuplicateReference(localDataSource, criterion.dataSources)) {
      return 'Duplicate reference';
    } else {
      return '';
    }
  }

  function hasMissingReference(): boolean {
    return criterion.dataSources.length > 1 && localDataSource.reference === '';
  }

  function hasDuplicateReference(
    dataSource: IDataSource,
    dataSources: IDataSource[]
  ): boolean {
    return _.some(dataSources, (otherDataSource) => {
      return (
        otherDataSource.id !== dataSource.id &&
        _.isEqual(otherDataSource.reference, dataSource.reference)
      );
    });
  }

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setIsButtonPressed(false);
    setLocalDataSource(_.cloneDeep(dataSource));
    setIsDialogOpen(true);
  }

  function unitChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setLocalDataSource(
      _.merge({}, localDataSource, {
        unitOfMeasurement: {label: event.target.value}
      })
    );
  }

  function referenceChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setLocalDataSource({...localDataSource, reference: event.target.value});
  }

  function referenceLinkChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setLocalDataSource({...localDataSource, referenceLink: event.target.value});
  }

  function strengthOfEvidenceChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setLocalDataSource({
      ...localDataSource,
      strengthOfEvidence: event.target.value
    });
  }

  function uncertaintyChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setLocalDataSource({...localDataSource, uncertainty: event.target.value});
  }

  function handleButtonClick(): void {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      closeDialog();
      let newCriterion: ICriterion = _.cloneDeep(criterion);
      newCriterion.dataSources[index] = localDataSource;
      editCriterion(newCriterion);
    }
  }

  function isDisabled(): boolean {
    return !!error || isButtonPressed;
  }

  return (
    <>
      <Tooltip title="Edit data source">
        <IconButton color="primary" onClick={openDialog}>
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
          Edit data source
        </DialogTitleWithCross>
        <DialogContent style={{overflow: 'hidden'}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Unit of measurement"
                id="unit-of-measurement-input"
                value={localDataSource.unitOfMeasurement.label}
                disabled={localDataSource.unitOfMeasurement.type !== 'custom'}
                onChange={unitChanged}
                variant="outlined"
                onKeyDown={handleKey}
                autoFocus
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reference"
                id="reference-input"
                value={localDataSource.reference}
                onChange={referenceChanged}
                variant="outlined"
                onKeyDown={handleKey}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reference link (optional)"
                id="reference-link-input"
                value={localDataSource.referenceLink}
                onChange={referenceLinkChanged}
                variant="outlined"
                onKeyDown={handleKey}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Strength of evidence (optional)"
                id="strength-of-evidence-input"
                value={localDataSource.strengthOfEvidence}
                onChange={strengthOfEvidenceChanged}
                variant="outlined"
                onKeyDown={handleKey}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Uncertainties (optional)"
                id="uncertainties-input"
                value={localDataSource.uncertainty}
                onChange={uncertaintyChanged}
                variant="outlined"
                onKeyDown={handleKey}
                fullWidth
              />
            </Grid>
            <Grid
              id={`error`}
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
            id={'edit-data-source-confirm-button'}
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
