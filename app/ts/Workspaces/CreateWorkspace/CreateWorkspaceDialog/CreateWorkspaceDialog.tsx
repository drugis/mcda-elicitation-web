import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Radio,
  RadioGroup,
  Select
} from '@material-ui/core';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import DisplayErrors from 'app/ts/util/DisplayErrors';
import _ from 'lodash';
import React, {ChangeEvent, useCallback, useContext} from 'react';
import {CreateWorkspaceContext} from '../CreateWorkspaceContext';
import IWorkspaceExample from '../IWorkspaceExample';
import {TWorkspaceCreationMethod} from '../TWorkspaceCreationMethod';

export default function CreateWorkspaceDialog({
  isDialogOpen,
  closeDialog
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
}): JSX.Element {
  const {
    examples,
    tutorials,
    method,
    setMethod,
    selectedProblem,
    setSelectedProblem,
    setUploadedFile,
    addWorkspaceCallback,
    validationErrors
  } = useContext(CreateWorkspaceContext);

  const handleMethodChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const method: TWorkspaceCreationMethod = event.target
        .value as TWorkspaceCreationMethod; //FIXME ?
      setMethod(method);
      if (method === 'example') {
        setSelectedProblem(examples[0]);
      } else if (method === 'tutorial') {
        setSelectedProblem(tutorials[0]);
      }
    },
    [setMethod, setSelectedProblem, examples, tutorials]
  );

  const SelectOptions = useCallback(
    ({
      workspaceExamples
    }: {
      workspaceExamples: IWorkspaceExample[];
    }): JSX.Element => {
      return (
        <>
          {_.map(
            workspaceExamples,
            (workspaceExample: IWorkspaceExample): JSX.Element => (
              <option
                value={workspaceExample.title}
                key={workspaceExample.title}
              >
                {workspaceExample.title}
              </option>
            )
          )}
        </>
      );
    },
    []
  );

  const handleExampleChanged = useCallback(
    (event: ChangeEvent<{value: string}>): void => {
      setSelectedProblem(_.find(examples, ['title', event.target.value]));
    },
    [setSelectedProblem, examples]
  );

  const handleTutorialChanged = useCallback(
    (event: ChangeEvent<{value: string}>): void => {
      setSelectedProblem(_.find(tutorials, ['title', event.target.value]));
    },
    [setSelectedProblem, tutorials]
  );

  const handleFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setUploadedFile(event.target.files[0]);
    },
    [setUploadedFile]
  );

  const handleAddButtonClick = useCallback((): void => {
    closeDialog();
    addWorkspaceCallback();
  }, [closeDialog, addWorkspaceCallback]);

  const renderWorkspaceInput = useCallback((): JSX.Element => {
    if (method === 'example') {
      return (
        <Select
          native
          id="example-workspace-selector"
          value={selectedProblem.title}
          onChange={handleExampleChanged}
          style={{minWidth: 220}}
        >
          <SelectOptions workspaceExamples={examples} />
        </Select>
      );
    } else if (method === 'tutorial') {
      return (
        <Select
          native
          id="tutorial-workspace-selector"
          value={selectedProblem.title}
          onChange={handleTutorialChanged}
          style={{minWidth: 220}}
        >
          <SelectOptions workspaceExamples={tutorials} />
        </Select>
      );
    } else if (method === 'upload') {
      return <input type="file" onChange={handleFileUpload} />;
    } else {
      return <></>;
    }
  }, [
    examples,
    method,
    selectedProblem,
    tutorials,
    handleExampleChanged,
    handleFileUpload,
    handleTutorialChanged,
    SelectOptions
  ]);

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth={'sm'}>
      <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
        Add workspace
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            Choose creation method
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              name="percentages-radio"
              value={method}
              onChange={handleMethodChanged}
            >
              <label id="example-workspace-radio">
                <Radio value="example" /> Select example workspace
              </label>
              <label id="tutorial-workspace-radio">
                <Radio value="tutorial" /> Select tutorial workspace
              </label>
              <label id="upload-workspace-radio">
                <Radio value="upload" /> Upload file
              </label>
              <label id="manual-workspace-radio">
                <Radio value="manual" /> Create new workspace
              </label>
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            {renderWorkspaceInput()}
          </Grid>
          <Grid item xs={3}>
            {!_.isEmpty(validationErrors) ? 'Invalid upload: ' : ''}
          </Grid>
          <Grid item xs={9}>
            <DisplayErrors
              identifier="invalid-schema"
              errors={validationErrors}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id="add-workspace-button"
          color="primary"
          onClick={handleAddButtonClick}
          variant="contained"
          disabled={!_.isEmpty(validationErrors)}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
